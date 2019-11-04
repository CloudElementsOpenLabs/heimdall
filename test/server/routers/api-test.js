'use strict'

const apiRouter = require('../../../server/routers/api-router')
const model = require('../../../db/model')
const orgSecret = process.env.TEST_ORG_SECRET
const authHeader = require('../../../src/authHeader')
  ({
    orgSecret,
    userSecret: process.env.TEST_USER_SECRET
  })
const express = require('express')
const bodyParser = require('body-parser')

const server = express()
server.use(bodyParser.json())
server.use(bodyParser.urlencoded())
server.use(apiRouter)
server.use(require('../../../server/errorCatcher'))

const destroyApplication = () => {
  model.applications.destroy({
    where: {
      orgSecret
    }
  })
}

const closeConnection = model.closeConnection

module.exports = {
  server,
  authHeader,
  authOrg: orgSecret,
  destroyApplication,
  closeConnection
}
