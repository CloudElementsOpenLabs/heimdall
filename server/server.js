'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const api = require('./routers/api-router')
const ui = require('./routers/ui-router')
const health = require('./routers/health-router')
const path = require('path')
const app = express()
const hbs = require('hbs')
const cookieParser = require('cookie-parser')
const { logger } = require("./logger")

hbs.registerPartials(path.resolve(__dirname, '../views/partials'))
hbs.registerHelper('ifCond', function (var1, var2, options) {
  if (var1 == var2) {
    return options.fn(this)
  }
  return options.inverse(this)
})

app.set('view engine', 'hbs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

//serve the sdk paramertized to the environment 
app.use('/v1/public/javascripts/:heimdall-sdk(\.js|\-staging\.js)', (req, res, next) => {
  res.type('application/javascript')
  res.render(`heimdall-sdk`, { baseUrl: process.env.BASE_URL })
})

app.use('/v1/public', express.static(path.resolve(__dirname, '../public/')))

app.use('/info', health)

app.use('/v1/api', api)

app.use('/v1', ui)

app.use(require('./errorCatcher'))

app.listen(process.env.PORT, () => logger.info(`Listening on port ${process.env.PORT}`))