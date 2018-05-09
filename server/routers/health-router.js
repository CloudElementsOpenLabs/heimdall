'use strict'

const express = require('express')
const health = express.Router()

health.get('/health', (req, res, next) => {
    res.send({success: true})
})

module.exports = health