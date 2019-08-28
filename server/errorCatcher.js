'use strict'

const express = require('express')
const app = express()

module.exports = (err, req, res, next) => {

    res.status(err.statusCode ? err.statusCode : res.statusCode)

    //logging
    let reason
    if((req.method =='POST' || req.method =='PUT') && req.body instanceof Array){
        reason = "Bad Request. Array instead of Entity"
        res.status(400)
    }
    else if (err.name === 'SequelizeEmptyResultError') {
        reason = "Record with provided ID not found"
        res.status(404)
    }
    else if (err.name === 'TokenExpiredError') {
        reason = "Token expired"
    }
    else if (err.error && err.error.message) {
        // CE error object includes: requestId, message, providermessage
        reason = err.error
    }
    else if (err.message) {
        reason = err.message
    }
    else {
        reason = "Unknown Error. Please contact support."
    }

    if (req.path.includes('api')) {
        res.json({ message: reason })
    }
    else {
        res.json({ message: reason })
    }
}

