'use strict';

const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/classrooms',
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
        tags: Joi.string().empty('').optional()
      }
    }
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const scheduleModel = db.model('schedule');

    const {tags} = request.query;
    const allTags = (tags || '').split(',').filter(Boolean);

    return (await scheduleModel.aggregate([
      {$group: {_id: '$classroom'}},
      ...(allTags.length ? [{$match: {'_id.equipment': {$all: allTags}}}] : []),
      {$project: {_id: 1}}
    ])).map(({_id}) => _id);
  }
};