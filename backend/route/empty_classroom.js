'use strict';

const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/classroom/empty',
  options: {
    tags: ['api'],
    validate: {
      query: {
        day: Joi.string().empty('').optional(),
        week: Joi.string().empty('').optional(),
        hour: Joi.string().empty('').optional(),
        tags: Joi.string().default('').optional()
      }
    }
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const scheduleModel = db.model('schedule');

    const {tags} = request.query;
    const allTags = tags.split(',').filter(Boolean);

    const {day, week, hour} = request.query;
    const days = (day ? day.split(',') : []).map(Number);
    const hours = (hour ? hour.split(',') : []).map(Number);
    const weeks = (week ? week.split(',') : []).map(Number);

    return (await scheduleModel.aggregate([
      {$group: {_id: '$classroom', schedule: {$addToSet: {day: '$weekday', hour: '$time', weeks: '$weeks'}}}},
      ...(day ? [{$match: {schedule: {$not: {$elemMatch: {day: {$in: days}}}}}}] : []),
      ...(hour ? [{$match: {schedule: {$not: {$elemMatch: {hour: {$in: hours}}}}}}] : []),
      ...(week ? [{$match: {schedule: {$not: {$elemMatch: {weeks: {$in: weeks}}}}}}] : []),
      ...(allTags.length ? [{$match: {'_id.equipment': {$all: allTags}}}] : []),
      {$project: {classroom: '$_id', equipment: '$_id.equipment', _id: 0}},
      {$sort: {'classroom.building': 1, 'classroom.number': 1}},
      {$match: {classroom: {$ne: null}}},
    ]));
  }
};