'use strict'

const {get} = require('./api')

module.exports = async (init, authData) => {
    let instances
    try {
        instances = await get(`elements/${init.sourceName}/instances`, {}, authData)
        return instances
    } catch (err) {
        if (err.statusCode === 404) {
            return []
        }
        else {
            throw err
        }
    }
}