'use strict';

const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/student/subject',
  options: {
    tags: ['api'],
    validate: {
      query: {
        day: Joi.string().empty('').optional(),
        week: Joi.string().empty('').optional(),
        hour: Joi.string().empty('').optional()
      }
    }
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const scheduleModel = db.model('schedule');

    const {day, week, hour} = request.query;
    const days = (day ? day.split(',') : []).map(Number);
    const hours = (hour ? hour.split(',') : []).map(Number);
    const weeks = (week ? week.split(',') : []).map(Number);

    return await scheduleModel.aggregate([
      ...(day ? [{$match: {weekday: {$in: days}}}] : []),
      ...(hour ? [{$match: {time: {$in: hours}}}] : []),
      ...(week ? [{$match: {weeks: {$in: weeks}}}] : []),
      {$match: {subject: {$ne: null}}},
      {$project: {_id: 0, teacher: 1, subject: 1, group: 1, day: '$weekday', hour: '$time', weeks: 1}},
      {$sort: {day: 1, hour: 1}}
    ]);
  }
};