'use strict';

const _ = require('lodash');
const Joi = require('joi');
const xlsx = require('node-xlsx');

const daysMap = require('./../constant/days');
const hoursMap = require('./../constant/hours');
const positions = require('./../constant/positions');

const {formatArray} = require('./../util/range_formatter');

module.exports = {
  method: 'GET',
  path: '/reports/classroomsLoad',
  options: {
    auth: {
      scope: ['admin'],
      strategy: 'jwt'
    },
    validate: {
      options: {
        allowUnknown: true
      },
      query: {
        restrooms: Joi.string().default('').optional()
      }
    }
  },
  handler: async (request, h) => {
    const {server: {app: {db}}} = request;
    const scheduleModel = db.model('schedule');

    const queryClassrooms = request.query.restrooms.split(',').filter(Boolean).map((auditorium) => {
      const [building, number] = auditorium.split('-');
      return {building, number};
    });

    const classrooms = (await scheduleModel.aggregate([
      ... (queryClassrooms.length) ? [{$match: {classroom: {$in: queryClassrooms}}}] : [],
      {$group: {_id: '$classroom'}}])).map(({_id}) => _id).filter(el => _.isObject(el));

    const days = (await scheduleModel.aggregate([{$group: {_id: '$weekday'}}])).map(({_id}) => _id).filter(el => _.isNumber(el)).sort((a, b) => a > b);
    const hours = (await scheduleModel.aggregate([{$group: {_id: '$time'}}])).map(({_id}) => _id).filter(el => _.isNumber(el)).sort((a, b) => a > b);
    const schedule = (await scheduleModel.find(queryClassrooms.length ? {classroom: {$in: queryClassrooms}} : {}));

    function getScheduleInfo(schedule, auditorium, hour, day) {
      return schedule
        .filter(({classroom, time, weekday}) => time === hour && day === weekday && _.isEqual(classroom, auditorium))[0];
    }

    function getFormattedTeacher(teacherName) {
      if (!teacherName) return teacherName;
      let result = teacherName;
      _.each(positions, (position) => result = result.replace(position, ''));
      return result.trim();
    }

    const ranges = [];

    const daysHeader = [null, null];
    _.each(days, (day) => {
      const startPoint = daysHeader.length;
      daysHeader.push(daysMap[day]);
      daysHeader.push(null);
      const endPoint = daysHeader.length - 1;
      const range = {s: {c: startPoint, r: 0}, e: {c: endPoint, r: 0}};
      ranges.push(range);
    });

    const scheduleData = [daysHeader];
    _.each(hours, (hour) => {
      const startPoint = scheduleData.length;
      _.each(classrooms, (classroom) => {
        const scheduleRow = [hoursMap[hour], classroom.building + '-' + classroom.number];
        _.each(days, (day) => {
          const {weeks, teacher} = getScheduleInfo(schedule, classroom, hour, day) || {};
          scheduleRow.push(getFormattedTeacher(teacher));
          scheduleRow.push(formatArray(weeks));
        });
        scheduleData.push(scheduleRow);
      });
      const endPoint = scheduleData.length - 1;
      const range = {s: {r: startPoint, c: 0}, e: {r: endPoint, c: 0}};
      ranges.push(range);
    });

    const option = {'!merges': ranges, cellStyles: {alignment: {wrapText: true}}};
    const buffer = xlsx.build([{name: 'mySheetName.xlsx', data: scheduleData}], option); // Returns a buffer
    return h.response(buffer)
      .type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      .header('Content-disposition', 'attachment; filename=' + 'mySheetName.xlsx');
  }
};