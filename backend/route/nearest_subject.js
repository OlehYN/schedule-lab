'use strict';

const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/teacher/nearest_subject',
  options: {
    tags: ['api'],
    validate: {
      query: {
        day: Joi.number().required(),
        week: Joi.number().required(),
        hour: Joi.number().required(),
        teacher: Joi.string().empty('').optional()
      }
    }
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const scheduleModel = db.model('schedule');

    const {day, week, hour, teacher} = request.query;
    const teachers = teacher ? teacher.split(',') : null;

    return await scheduleModel.aggregate([
      {$unwind: '$weeks'},
      ...(teacher ? [{$match: {teacher: {$in: teachers}}}] : []),
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
          subject: 1, classroom: 1, weeks: 1, day: '$weekday', hour: '$time', teacher: 1,
          coefficient: {
            $add: [
              {$multiply: [1000, {$subtract: ['$weeks', week]}]},
              {$multiply: [100, {$subtract: ['$weekday', day]}]},
              {$multiply: [10, {$subtract: ['$time', hour]}]}
            ]
          }
        }
      },
      {$sort: {coefficient: 1}}
    ]);
  }
};