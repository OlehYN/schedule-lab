'use strict';

const _ = require('lodash');
const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/teacher/group',
  options: {
    tags: ['api'],
    validate: {
      query: {
        teacher: Joi.string().optional()
      }
    }
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const scheduleModel = db.model('schedule');

    const {teacher} = request.query;
    const teachers = teacher ? teacher.split(',') : null;

    // TODO fix duplicates, fix sorting
    return (await scheduleModel.aggregate([
      ...(teacher ? [{$match: {teacher: {$in: teachers}}}] : []),
      {$project: {teacher: 1, subject: 1, group: 1}},
      {$unwind: '$group'},
      {$group: {_id: '$teacher', schedule: {$addToSet: {subject: '$subject', group: '$group'}}}},
      {$project: {teacher: '$_id', _id: 0, schedule: 1}},
      {$sort: {teacher: 1}}
    ])).map(({teacher, schedule}) =>
      ({
        teacher,
        schedule: _.uniq(schedule)
          .sort(({subject: subjectA, group: groupA}, {subject: subjectB, group: groupB}) => subjectA.localeCompare(subjectB) || String(groupA).localeCompare(String(groupB)))
      }));
  }
};