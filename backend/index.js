'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

const good = require('good');
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
  routes: {cors: true}
});

server.app.db = mongoose;

async function start() {
  try {
    await mongoose.connect(MONGO_URL);
    await model(mongoose);

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

    const swaggerOptions = {
      info: {
        title: 'Schedule API Documentation',
        version: Pack.version,
      },
      securityDefinitions: {
        'jwt': {
          'type': 'apiKey',
          'name': 'Authorization',
          'in': 'header'
        }
      },
      security: [{'jwt': []}],
    };

    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions
      }
    ]);
    await server.start();
  } catch (err) {
    server.log(['error'], err);
    throw err;
  }

  server.log(['init'], `Server running at: ${server.info.uri}`);
}

(async function () {
  await start();
})();
