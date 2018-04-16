'use strict';

const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/teachers',
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
        teacher: Joi.string().empty('').optional(),
        subject: Joi.string().empty('').optional()
      }
    }
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const {teacher, subject} = request.query;
    const scheduleModel = db.model('schedule');

    const teachers = teacher ? teacher.split(',') : null;
    const subjects = subject ? subject.split(',') : null;

    return (await scheduleModel.aggregate([
      {$group: {_id: '$subject', teachers: {$addToSet: '$teacher'}}},
      ...(teacher ? [{$match: {teachers: {$in: teachers}}}] : []),
      ...(subject ? [{$match: {_id: {$in: subjects}}}] : []),
      {$project: {_id: 0, teachers: 1}},
      {$unwind: '$teachers'},
      {$group: {_id: '$teachers'}}
    ])).map(({_id}) => _id);
  }
};