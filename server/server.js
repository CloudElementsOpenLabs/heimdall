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

hbs.registerPartials(path.resolve(__dirname, '../views/partials'))
hbs.registerHelper('ifCond', function (var1, var2, options) {
  if (var1 == var2) {
    return options.fn(this)
  }
  return options.inverse(this)
})

app.set('view engine', 'hbs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cookieParser())

app.use('/v1/public', express.static(path.resolve(__dirname, '../public/')))

app.use('/info', health)

app.use('/v1/api', api)

app.use('/v1', ui)

app.use(require('./errorCatcher'))

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))
