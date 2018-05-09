'use strict'

const { get } = require('./api');

module.exports = async (sourceName, authData) => {
    let instances
    try {
        instances = await get(`elements/${sourceName}/instances`, {}, authData)
    } catch (err) {
        if (err.statusCode === 404) {
            return []
        }
        else {
            throw err
        }
    }
    return instances
}