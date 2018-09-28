"use strict"
const rp = require('request-promise')

const get = async (url, query, authorization) => {
  let options = {
    json: true,
    headers: { Authorization: authorization },
    qs: query,
    url: url,
    method: "GET"
  }
  return await rp(options)
}

const post = async (url, body, authorization) => {
  let options = {
    json: true,
    headers: { Authorization: authorization },
    body: body,
    url: url,
    method: "POST"
  }
  return await rp(options)
}

const remove = async (url, authorization) => {
  let options = {
    json: true,
    headers: { Authorization: authorization },
    url: url,
    method: "DELETE"
  }
  return await rp(options)
}

module.exports = {
  get,
  post,
  remove
}
