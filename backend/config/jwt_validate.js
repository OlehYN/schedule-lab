'use strict';

const people = {
  1: {
    id: 1,
    name: 'Jen Jones'
  }
};

module.exports = async (decoded) => {
  if (!people[decoded.id]) {
    return {isValid: false};
  }
  else {
    return {isValid: true, scope: ['admin']};
  }
};