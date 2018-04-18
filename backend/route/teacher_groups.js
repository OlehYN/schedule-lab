'use strict';

const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/teacher/groups',
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
        teacher: Joi.string().required()
      }
    }
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const scheduleModel = db.model('schedule');

    const {teacher} = request.query;

    return (await scheduleModel.aggregate([
      {$match: {teacher}},
      {$match: {group: {$not: {$in: ['лекція']}}}},
      {$project: {subject: 1, group: 1}},
      {$unwind: '$group'},
      {$group: {_id: {subject: '$subject', group: '$group'}}},
    ])).map(({_id}) => _id);
  }
};