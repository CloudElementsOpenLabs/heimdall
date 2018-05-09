'use strict'

const { applications } = require('../db/model')

module.exports = async orgSecret => await applications.findOne({rejectOnEmpty: true, where: { orgSecret: orgSecret }})