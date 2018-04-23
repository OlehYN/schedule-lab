'use strict';

const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/classroom/teacher',
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
    const {teacher} = request.query;

    const teachers = teacher ? teacher.split(',') : null;
    const scheduleModel = db.model('schedule');

    return (await scheduleModel.aggregate([
      ...(teacher ? [{$match: {teacher: {$in: teachers}}}] : []),
      {
        $group:
          {
            _id: '$classroom',
            schedule: {
              $addToSet: {
                day: '$weekday',
                hour: '$time',
                weeks: '$weeks',
                teacher: '$teacher',
                subject: '$subject'
              }
            }
          }
      }
    ])).map(({_id, schedule}) => ({room: _id, schedule}));
  }
};