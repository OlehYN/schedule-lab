'use strict';

const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/teacher/nearest_subject',
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
        day: Joi.number().required(),
        week: Joi.number().required(),
        hour: Joi.number().required(),
        teacher: Joi.string().required()
      }
    }
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const scheduleModel = db.model('schedule');

    const {day, week, hour, teacher} = request.query;

    return await scheduleModel.aggregate([
      {$unwind: '$weeks'},
      {$match: {teacher: {$regex: `.*${teacher}.*`}}},
      {
        $match:
          {
            $or:
              [
                {weeks: {$gt: week}},
                {weeks: {$eq: week}, weekday: {$gt: day}},
                {weeks: {$eq: week}, weekday: {$eq: day}, time: {$gte: hour}}
              ]
          }
      },
      {
        $project: {
          subject: 1, classroom: 1, weeks: 1, weekday: 1, time: 1, teacher: 1,
          coefficient: {
            $add: [
              {$abs: {$multiply: [1000, {$subtract: ['$weeks', week]}]}},
              {$abs: {$multiply: [100, {$subtract: ['$weekday', day]}]}},
              {$abs: {$multiply: [10, {$subtract: ['$time', hour]}]}}
            ]
          }
        }
      },
      {$sort: {coefficient: 1}}
    ]);
  }
};