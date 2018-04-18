'use strict';

const days = require('./../constant/days');

const _ = require('lodash');
const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/teacher/load',
  options: {
    tags: ['api'],
    auth: {
      scope: ['admin'],
      strategy: 'jwt'
    },
    validate: {
      options: {
        allowUnknown: true
      },
      query: {
        name: Joi.string().empty('').optional(),
        week: Joi.number().optional()
      }
    }
  },
  // TODO add extra filtering
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const {name, week} = request.query;

    const scheduleModel = db.model('schedule');

    const availableAuditoriums = (await scheduleModel.aggregate([
      ...(name ? [{$match: {teacher: {$regex: `.*${name}.*`}}}] : []),
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

    const dayIds = _.keys(days);
    const teachersSchedule = await availableAuditoriums;
    return teachersSchedule.map(({teacher, schedule}) => ({
      teacher,
      schedule: dayIds.map((id) => ({day: id, subjects: schedule.filter(({day}) => Number(day) === Number(id))}))
    }));
  }
};