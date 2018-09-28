'use strict'

const apiRouter = require('../../../server/routers/api-router')
const model = require('../../../db/model')
const express = require('express')
const bodyParser = require('body-parser')

const server = express()
server.use(bodyParser.json())
server.use(bodyParser.urlencoded())
server.use(apiRouter)
server.use(require('../../../server/errorCatcher'))

const authUser = process.env.TEST_USER_SECRET

const authOrg = process.env.TEST_ORG_SECRET

const authorization = `User ${authUser}, Organization ${authOrg}`

const destroyApplication = () => {
  model.applications.destroy({
    where: {
      orgSecret: authOrg
    }
  })
}

const closeConnection = model.closeConnection

module.exports = {
  server,
  authOrg,
  authUser,
  authorization,
  destroyApplication,
  closeConnection
}
