'use strict';

const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/student/subject',
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
        hour: Joi.number().required()
      }
    }
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const scheduleModel = db.model('schedule');

    const {day, week, hour} = request.query;

    return await scheduleModel.aggregate([
      {$match: {weekday: day, time: hour, weeks: {$in: [week]}}},
      {$project: {_id: 0, teacher: 1, subject: 1, group: 1}}
    ]);
  }
};