'use strict';

const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/classroom/teacher',
  options: {
    tags: ['api'],
    validate: {
      query: {
        name: Joi.string().required().description('Teacher name')
      }
    }
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const {name} = request.query;

    const scheduleModel = db.model('schedule');

    return (await scheduleModel.aggregate([
      {$match: {teacher : {$regex : `.*${name}.*`}}},
      {$group: {_id: '$classroom', schedule: {$addToSet: {day: '$weekday', hour: '$time', weeks: '$weeks'}}}}
    ])).map(({_id, schedule}) => ({room: _id, schedule}));
  }
};