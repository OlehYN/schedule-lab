'use strict';

module.exports = {
  method: 'GET',
  path: '/reports/duplicates/teacher',
  options: {
    auth: {
      scope: ['admin'],
      strategy: 'jwt'
    }
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const scheduleModel = db.model('schedule');

    const duplicates = await scheduleModel.aggregate([{$unwind: '$weeks'}, {
      $group: {
        _id: {
          week: '$weeks',
          weekday: '$weekday',
          teacher: '$teacher',
          time: '$time'
        }, countDuplicates: {$sum: 1}, schedule: {$addToSet: {subject: '$subject', classroom: '$classroom', group: '$group'}}
      }
    }, {$match: {countDuplicates: {$gt: 1}}}]);

    return duplicates;
  }
};