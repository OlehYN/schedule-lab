'use strict';

module.exports = (mongoose) => {
  mongoose.model('schedule', require('./schedule')(mongoose));
  mongoose.model('student', require('./student')(mongoose));
};