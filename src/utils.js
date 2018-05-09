'use strict'
// TODO: break this file apart

const jwt = require('jsonwebtoken')
const { curry, pick, map, prop, converge, filter, pipe, isNil, not, merge, find, propEq, pair, fromPairs } = require('ramda')
const { encrypt, decrypt } = require('./encryption')

const buildValueConfiguration = curry((elementConfig, props) => pick(map(prop("key"), elementConfig))(props))

const buildDefaultValues = pipe(
    filter(pipe(prop('defaultValue'), isNil, not)),
    map(converge(pair, [prop('key'), prop('defaultValue')])),
    fromPairs
)

const buildConfiguration = curry((elementConfig, props) => merge(buildDefaultValues(elementConfig),
    buildValueConfiguration(elementConfig, props)))

const getConfigValue = curry((elementConfig, key) => pipe(find(propEq('key', key)), prop('defaultValue'))(elementConfig))

const createToken = obj => encrypt(jwt.sign(obj, process.env.SECRET_KEY, { expiresIn: fmtExp(process.env.EXPIRES_IN) }))

const parseToken = token => jwt.verify(decrypt(token), process.env.SECRET_KEY)

const needsUserConfig = pipe(find(prop('display')), isNil, not)

const fmtExp = m => (isNaN(m) ? m : (m * 1000).toString())

module.exports = {
    createToken,
    parseToken,
    needsUserConfig,
    buildConfiguration,
    getConfigValue
}