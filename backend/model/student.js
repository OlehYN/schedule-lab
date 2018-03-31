'use strict';

module.exports = (mongoose) => {
  const Schema = mongoose.Schema;

  return new Schema({
    name: String,
    faculty: String,
    subjects: Array,
    department: String
  });
};