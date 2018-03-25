'use strict';

const Hapi = require('hapi');

const good = require('good');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const yar = require('yar');

const model = require('./model');
const route = require('./route');
const validate = require('./config/jwt_validate');

const yarConfig = require('./config/yar_config');
const goodConfig = require('./config/good_config');

const hapuAuthJwt2 = require('hapi-auth-jwt2');

const {HOST, PORT, MONGO_URL, JWT_TOKEN} = require('./config.json');

const server = Hapi.server({
  host: HOST,
  port: PORT,
});

server.app.db = mongoose;

async function start() {
  try {
    await mongoose.connect(MONGO_URL);
    await model(mongoose);
    mongodb.con

    await server.register({plugin: good, options: goodConfig});
    await server.register({plugin: yar, options: yarConfig});

    await server.register(hapuAuthJwt2);
    await server.auth.strategy('jwt', 'jwt', {
      key: JWT_TOKEN,
      validate,
      verifyOptions: {algorithms: ['HS256']}
    });
    await server.auth.default('jwt');
    await server.route(route);

    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
}

(async function () {
  await start();
})();
