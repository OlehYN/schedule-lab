'use strict';

const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/classroom/empty',
  options: {
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
        tags: Joi.string().default('').optional()
      }
    }
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const scheduleModel = db.model('schedule');

    const {day, week, hour, tags} = request.query;
    const allTags = tags.split(',').filter(Boolean);

    const availableAuditoriums = (await scheduleModel.aggregate([
      {$group: {_id: '$classroom', schedule: {$addToSet: {day: '$weekday', hour: '$time', weeks: '$weeks'}}}},
      {$match: {schedule: {$not: {$elemMatch: {day, hour, weeks: {$in: [week]}}}}}},
      ...(allTags.length ? [{$match: {tags: {$all: allTags}}}] : []),
      {$project: {_id: 1}}
    ])).map(({_id}) => _id);
    return await availableAuditoriums;
  }
};