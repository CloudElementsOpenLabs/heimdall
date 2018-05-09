'use strict'

const { get } = require('./api')

module.exports = async authHeader => await get('organizations/me', null, authHeader)