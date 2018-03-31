'use strict';

module.exports = (mongoose) => {
  const Schema = mongoose.Schema;

  return new Schema({
    classroom: Object,
    teacher: String,
    subject: String,
    group: Array,
    time: Number,
    weekday: Number,
    weeks: Array
  }, { collection: 'schedule' });
};