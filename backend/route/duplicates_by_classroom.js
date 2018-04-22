'use strict';

module.exports = {
  method: 'GET',
  path: '/reports/duplicates/classroom',
  options: {
    tags: ['api']
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const scheduleModel = db.model('schedule');

    const duplicates = await scheduleModel.aggregate([{$unwind: '$weeks'}, {
      $group: {
        _id: {
          week: '$weeks',
          weekday: '$weekday',
          classroom: '$classroom',
          time: '$time'
        }, countDuplicates: {$sum: 1}, schedule: {$addToSet: {subject: '$subject', teacher: '$teacher', group: '$group'}}
      }
    }, {$match: {countDuplicates: {$gt: 1}}}]);

    return duplicates;
  }
};