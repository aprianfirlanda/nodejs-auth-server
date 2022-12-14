require('dotenv').config()
const Hapi = require('@hapi/hapi')
const config = require('./utils/config')

const init = async () => {
  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.start()
  console.log(`Running server on ${server.info.uri}`)
}

init()
