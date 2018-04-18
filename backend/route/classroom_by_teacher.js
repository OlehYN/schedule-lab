'use strict';

const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/classroom/teacher',
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
        name: Joi.string().required().description('Teacher name')
      }
    }
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const {name} = request.query;

    const scheduleModel = db.model('schedule');

    const availableAuditoriums = (await scheduleModel.aggregate([
      {$match: {teacher : {$regex : `.*${name}.*`}}},
      {$group: {_id: '$classroom', schedule: {$addToSet: {day: '$weekday', hour: '$time', weeks: '$weeks'}}}}
    ])).map(({_id, schedule}) => ({room: _id, schedule}));

    return await availableAuditoriums;
  }
};