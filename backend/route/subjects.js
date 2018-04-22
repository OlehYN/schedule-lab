'use strict';

module.exports = {
  method: 'GET',
  path: '/subjects',
  options: {
    tags: ['api']
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const scheduleModel = db.model('schedule');

    return (await scheduleModel.aggregate([
      {$group: {_id: '$subject'}},
      {$project: {_id: 1}},
      {$sort: {_id: 1}}
    ])).map(({_id}) => _id).filter(Boolean);
  }
};