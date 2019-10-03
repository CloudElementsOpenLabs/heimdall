'use strict'

const { logger } = require("./logger")

module.exports = (err, req, res, next) => {

    res.status(err.statusCode ? err.statusCode : res.statusCode)

    //logging
    let message, requestId, providerMessage
    if ((req.method == 'POST' || req.method == 'PUT') && req.body instanceof Array) {
        message = "Bad Request. Array instead of Entity"
        res.status(400)
    }
    else if (err.name === 'SequelizeEmptyResultError') {
        message = "Record with provided ID not found"
        res.status(404)
    }
    // Prefer CE error message 
    else if (err.error && err.error.requestId) {
        requestId = err.error.requestId
        message = err.error.message
        providerMessage = err.error.providerMessage
    }

    if (!message) {
        if (err.message) {
            message = err.message
        }
        else if (err) {
            message = err
        }
        else {
            message = "Unknown Error. Please contact support."
        }
    }

    //server logs
    logger.error({ message, providerMessage, requestId, stack:err.stack })

    //send response
    //providerMessage and requestId are only set if error originates at CE
    res.json({ message, providerMessage, requestId })

}