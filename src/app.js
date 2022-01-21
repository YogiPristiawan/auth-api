require('dotenv').config()
const createServer = require('./Infrastuctures/http/createServer')
const container = require('./Infrastuctures/container')

const start = async () => {
  const server = await createServer(container)
  await server.start()
  console.log(`server start at ${server.info.uri}`)
}

start()
