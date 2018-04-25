'use strict';

const days = require('./../constant/days');

const _ = require('lodash');
const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/teacher/load',
  options: {
    tags: ['api'],
    validate: {
      query: {
        name: Joi.string().empty('').optional(),
        week: Joi.number().empty('').optional(),
        subject: Joi.string().empty('').optional()
      }
    }
  },
  // TODO add extra filtering
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const {name, week, subject} = request.query;

    const scheduleModel = db.model('schedule');

    const teachers = name ? name.split(',') : [];
    const subjects = subject ? subject.split(',') : [];
    const availableAuditoriums = (await scheduleModel.aggregate([
      ...(name ? [{$match: {teacher: {$in: teachers}}}] : []),
      ...(subject ? [{$match: {subject: {$in: subjects}}}] : []),
      ...(week ? [{$match: {weeks: {$in: [week]}}}] : []),
      {
        $group: {
          _id: '$teacher',
          schedule: {
            $addToSet: {
              day: '$weekday',
              hour: '$time',
              weeks: '$weeks',
              classroom: '$classroom',
              subject: '$subject',
              group: '$group'
            }
          }
        }
      }
    ])).map(({_id, schedule}) => ({teacher: _id, schedule}));

    function sortSchedule({hour: hourA}, {hour: hourB}) {
      return hourA > hourB;
    }

    const dayIds = _.keys(days);
    const teachersSchedule = await availableAuditoriums;
    return teachersSchedule.map(({teacher, schedule}) => ({
      teacher,
      schedule: dayIds.map((id) => ({day: id, subjects: schedule.filter(({day}) => Number(day) === Number(id)).sort(sortSchedule)}))
    }));
  }
};