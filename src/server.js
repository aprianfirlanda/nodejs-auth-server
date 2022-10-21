require('dotenv').config();
const Hapi = require('@hapi/hapi');
const config = require('./utils/config');

// errors
const ClientError = require('./exceptions/ClientError');

// users
const users = require('./api/users');
const UsersService = require('./services/UsersService');
const UsersRepository = require('./repository/postgres/UsersRepository');
const UsersValidator = require('./validator/users');

const init = async () => {
  // users
  const usersRepository = new UsersRepository();
  const usersService = new UsersService(UsersValidator, usersRepository);

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: users,
      options: {
        usersService,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'Fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      console.error(response);
      const newResponse = h.response({
        status: 'Error',
        message: 'a failure occurred on our servers',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Running server on ${server.info.uri}`);
};

init();
