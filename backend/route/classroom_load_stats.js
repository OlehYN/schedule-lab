'use strict';

const _ = require('lodash');
const Joi = require('joi');
const xlsx = require('xlsx');

const daysMap = require('./../constant/days');
const hoursMap = require('./../constant/hours');
const positions = require('./../constant/positions');

const {formatArray} = require('./../util/range_formatter');

module.exports = {
    method: 'GET',
    path: '/reports/classrooms/load',
    options: {
        tags: ['api'],
        validate: {
            query: {
                classrooms: Joi.string().default('').optional(),
                teachers: Joi.string().default('').optional(),
                subjects: Joi.string().default('').optional()
            }
        }
    },
    handler: async (request, h) => {
        const {server: {app: {db}}} = request;
        const scheduleModel = db.model('schedule');

        const queryClassrooms = request.query.classrooms.split(',').filter(Boolean).map((auditorium) => {
            const [building, number] = auditorium.split('-');
            return {building, number};
        });
        const teachers = request.query.teachers.split(',').filter(Boolean);
        const subjects = request.query.subjects.split(',').filter(Boolean);

        const classrooms = {};
        (await scheduleModel.aggregate([
            ... (queryClassrooms.length) ? [{$match: {classroom: {$in: queryClassrooms}}}] : [],
            ... (teachers.length) ? [{$match: {teacher: {$in: teachers}}}] : [],
            ... (subjects.length) ? [{$match: {subject: {$in: subjects}}}] : [],
            {$group: {_id: '$classroom.building', numbers: {$addToSet: '$classroom.number'}}},
            {$sort:{"_id": 1}}
        ])).forEach(({_id, numbers}) => classrooms[_id] = numbers.sort());

        const days = (await scheduleModel.aggregate([{$group: {_id: '$weekday'}}])).map(({_id}) => _id).filter(el => _.isNumber(el)).sort((a, b) => a - b);
        const hours = (await scheduleModel.aggregate([{$group: {_id: '$time'}}])).map(({_id}) => _id).filter(el => _.isNumber(el)).sort((a, b) => a - b);

        const aggregate = [
            ... (queryClassrooms.length ? [{$match: {classroom: {$in: queryClassrooms}}}] : []),
            ... (teachers.length) ? [{$match: {teacher: {$in: teachers}}}] : [],
            ... (subjects.length) ? [{$match: {subject: {$in: subjects}}}] : []
        ];
        const schedule = aggregate.length ? (await scheduleModel.aggregate(aggregate)) : (await scheduleModel.find({}));

        const workBook = buildBook(schedule, classrooms, days, hours);
        const excelData = xlsx.write(workBook, Object.assign({}, {
            bookType: 'xlsx',
            bookSST: false,
            type: 'binary'
        }));
        const buffer = excelData instanceof Buffer ? excelData : Buffer.from(excelData, 'binary');
        return h.response(buffer)
            .type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            .header('Content-disposition', 'attachment; filename=' + 'schedule.xlsx');
    }
};

function buildBook(schedule, classrooms, days, hours) {
    const workBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workBook, buildSheet(schedule, classrooms, days, hours));
    return workBook;
}

function buildSheet(schedule, classrooms, days, hours) {
    const sidebarWidth = 2;
    const blockWidth = 3;

    const ranges = [range(0, 0, sidebarWidth - 1, 1)];
    const classroomsHeader = [Array(sidebarWidth).fill(null), Array(sidebarWidth).fill(null)];
    _.each(classrooms, (numbers, b) => {
        const bStart = classroomsHeader[0].length;
        classroomsHeader[0].push(b, ...Array((numbers.length) * blockWidth - 1).fill(null));
        ranges.push(range(bStart, 0, classroomsHeader[0].length - 1, 0));
        _.each(numbers, (n) => {
            const nStart = classroomsHeader[1].length;
            classroomsHeader[1].push(n, ...Array(blockWidth - 1).fill(null));
            ranges.push(range(nStart, 1, classroomsHeader[1].length - 1, 1));
        });
    });

    const scheduleData = [...classroomsHeader];
    _.each(days, (d) => {
        const dStart = scheduleData.length;
        const daySchedule = schedule.filter(({weekday}) => weekday === d);
        _.each(hours, (h) => {
            const hStart = scheduleData.length;
            const hourSchedule = daySchedule.filter(({time}) => time === h);
            const scheduleBlocks = [];
            let blockHeight = 1;
            _.each(classrooms, (numbers, b) => {
                const buildingSchedule = hourSchedule.filter(({classroom: {building}}) => building === b);
                _.each(numbers, (n) => {
                    let numberSchedule = buildingSchedule.filter(({classroom: {number}}) => number === n);
                    numberSchedule = mergeSchedules(numberSchedule);
                    blockHeight = Math.max(blockHeight, numberSchedule.length);
                    const block = numberSchedule.map(({weeks, teacher, subject}) => [
                        formatArray(weeks), getFormattedTeacher(teacher), subject
                    ]);
                    scheduleBlocks.push(block);
                });
            });
            scheduleBlocks.map((block, i) => {
                if(blockHeight > 1 && block.length <= 1)
                    ranges.push(...Array(blockWidth).fill().map((e, offset) => {
                        const col = sidebarWidth + blockWidth * i + offset;
                        return range(col, hStart, col, hStart + blockHeight - 1);
                    }));
                return block.push(...Array(blockHeight - block.length).fill(Array(blockWidth).fill(null)));
            });
            const scheduleRows = Array(blockHeight).fill().map((e, row) =>
                _.flatMap(scheduleBlocks, (block) => block[row]));
            _.each(scheduleRows, (row) => scheduleData.push([null, null, ...row]));
            ranges.push(range(1, hStart, 1, scheduleData.length - 1));
            scheduleData[hStart][1] = hoursMap[h];
        });
        ranges.push(range(0, dStart, 0, scheduleData.length - 1, ));
        scheduleData[dStart][0] = daysMap[d];
    });

    const workSheet = buildSheetFromData(scheduleData);
    workSheet['!merges'] = ranges;
    workSheet['!cols'] = getColumnWidths(scheduleData);
    return workSheet;
}

function buildSheetFromData(data) {
    const workSheet = {};
    for (let r = 0; r !== data.length; r += 1) {
        for (let c = 0; c !== data[r].length; c += 1) {
            if (data[r][c] === null) {
                continue;
            }
            const cellRef = xlsx.utils.encode_cell({c: c, r: r});
            workSheet[cellRef] = cell(r, c, data);
        }
    }
    workSheet['!ref'] = xlsx.utils.encode_range(range(0, 0, data[0].length - 1, data.length - 1));
    return workSheet;
}

function range(left, top, right, bottom) {
    return {s: {c: left, r: top}, e: {c: right, r: bottom}}
}

function cell(row, col, data) {
    return {v: data[row][col], t: 's'};
}

function getColumnWidths(data) {
    return Array(data[0].length).fill().map((e, col) => {
        const w = Array(data.length).fill().map((e, row) => row).reduce((max, row) => {
            const value = data[row][col];
            return value ? Math.max(max, value.length): max;
        }, 0);
        return {wch: w};
    });
}

function getFormattedTeacher(teacherName) {
    if (!teacherName) return teacherName;
    let result = teacherName;
    _.each(positions, (position) => result = result.replace(position, ''));
    return result.trim();
}

function mergeSchedules(schedules) {
    const trimProps = (s) => (({ teacher, subject }) => ({ teacher, subject }))(s);
    const merged = [];
    _.each(schedules, (s1) => {
        const same = _.find(merged, s2 => _.isEqual(trimProps(s1), trimProps(s2)));
        if (same) {
            same['weeks'] = _.sortedUniq(_.concat(same['weeks'], ...s1['weeks']).sort((a, b) => a - b));
        } else {
            merged.push(s1);
        }
    });
    return merged;
}