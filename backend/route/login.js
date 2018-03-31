'use strict';

const Joi = require('joi');
const jwt = require('jsonwebtoken');

module.exports = {
  method: 'POST',
  path: '/login',
  options: {
    auth: false,
    validate: {
      payload: {
        login: Joi.string().min(3).max(10),
        password: Joi.string().min(3).max(10)
      }
    }
  },
  handler: (request) => {
    request.yar.set('example', {key: 'value'});
    const token = jwt.sign({id: 1, scope: ['admin']}, process.env.JWT_TOKEN);
    return {token};
  }
};