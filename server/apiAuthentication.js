'use strict'

const validateCEAuth = require('../src/validateCEAuth')
const getApplication = require('../src/getApplication')
const R = require('ramda')
const getUserSecret = R.converge(R.pipe(R.nth, R.replace(',', '')), [
        R.pipe(R.split(' '), R.indexOf('User'), R.inc), 
        R.split(' ')])

module.exports = async (req, res, next) => {
    const authHeader = req.get("Authorization")
    if (!authHeader) {
        res.status(401)
        throw new Error(`Invalid authorization header. Pass Authorization: User {userSecret}, Organization {orgSecret}`)
    } else {
        req.authData = {}
        try {
            req.authData.orgSecret = (await validateCEAuth(authHeader)).secret
            req.authData.userSecret = getUserSecret(authHeader)
            if (!(req.path === '/applications' && req.method === 'POST')) {
                req.authData.applicationId = (await getApplication(req.authData.orgSecret)).id
            }
            next()
        } catch (err) {
            res.status(401)
            throw new Error(`Invalid authorization header. Pass Authorization: User {userSecret}, Organization {orgSecret}`)
        }
    }
}