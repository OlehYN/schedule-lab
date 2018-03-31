'use strict';

const _ = require('lodash');

module.exports = {
  formatArray: (arr) => {
    if (!arr || !_.isArray(arr) || !arr.length) return null;
    let result = '';
    let initPoint = arr[0];
    let lastElement = arr[0];
    _.each(arr, (elem) => {
      if (!(elem === lastElement || elem - 1 === lastElement)) {
        if (lastElement === initPoint) {
          result += initPoint + ',';
        } else {
          result += initPoint + '-' + lastElement + ',';
        }
        initPoint = elem;
        lastElement = elem;
      } else {
        lastElement = elem;
      }
    });

    if (lastElement === initPoint) {
      result += initPoint + ',';
    } else {
      result += initPoint + '-' + lastElement + ',';
    }
    return result.substring(0, result.length - 1);
  }
};