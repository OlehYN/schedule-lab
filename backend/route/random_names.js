'use strict';

const _ = require('lodash');

const randomName = require('node-random-name');

module.exports = {
  method: 'GET',
  path: '/random/names',
  options: {
    tags: ['api']
  },
  handler: async (request) => {
    const {server: {app: {db}}} = request;
    const scheduleModel = db.model('schedule');

    const teachers = await scheduleModel.find({}, {teacher: 1, _id: 0});
    const uniqueTeachers = _.uniq(_.map(teachers, 'teacher'));
    const generatedTeachers = [];
    while (uniqueTeachers.length !== generatedTeachers.length) {
      const generatedName = randomName();
      if (!generatedTeachers.includes(generatedName)) {
        generatedTeachers.push(generatedName);
      }
    }

    for (let i = 0; i < generatedTeachers.length; i++) {
      const teacher = uniqueTeachers[i];
      const generatedTeacher = generatedTeachers[i];

      await scheduleModel.update({teacher}, {$set: {teacher: generatedTeacher}}, {upsert: false, multi: true});
    }
    return {};
  }
};