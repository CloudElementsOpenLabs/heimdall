'use strict';

const { curry } = require('ramda')
const rp = require('request-promise')
const authHeader = require('./authHeader')

const get = curry(async (path, query, authData) => {
    let options = {
        json: true,
        headers: {
            Authorization: authData instanceof Object ? authHeader(authData) : authData,
        },
        qs: query,
        url: process.env.CE_BASE_URL + path,
        method: "GET"
    };
    return await rp(options)
})

const post = curry(async (path, body, authData) => {
    let options = {
        json: true,
        headers: {
            Authorization: authData instanceof Object ? authHeader(authData) : authData,
        },
        body: body,
        url: process.env.CE_BASE_URL + path,
        method: "POST"
    };
    return await rp(options)
})

const put = curry(async (path, body, authData) => {
    let options = {
        json: true,
        headers: {
            Authorization: authData instanceof Object ? authHeader(authData) : authData,
        },
        body: body,
        url: process.env.CE_BASE_URL + path,
        method: "PUT"
    };
    return await rp(options)
})

const remove = curry(async (path, authData) => {
    let options = {
        json: true,
        headers: {
            Authorization: authData instanceof Object ? authHeader(authData) : authData,
        },
        url: process.env.CE_BASE_URL + path,
        method: "DELETE"
    };
    return await rp(options)
})

module.exports = {
    get,
    post,
    put,
    remove
}