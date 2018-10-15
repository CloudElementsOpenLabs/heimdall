'use strict'

const util = require('../src/utils')
const { applications, elements } = require('../db/model')
const {pipe} = require('ramda')

const getApplication = async applicationId => {
    let application = await applications.findOne({ where: { id: applicationId } })
    if (application && application.orgSecret) {
        return application
    } else {
        throw new Error(`No application for for ID ${applicationId}`)
    }
}
// if elementKey is numeric, go get the key
const getKeyById = async id => {
    if (Number.isInteger(+id)) {
        let element = await elements.findById(+id)
        return element.key
    }
    return id
}

module.exports = async (req, res, next) => {
    // if this is the basic auth callback
    if (req.body.instance) {
        res.render('send-result', JSON.stringify({ id: req.body.instance.id, token: req.body.instance.token }))
    }
   
    req.elementKey =  await pipe(util.findInRequest('elementKey'), getKeyById)(req)  
    req.applicationId = util.findInRequest('applicationId', req)
    req.instanceId = util.findInRequest('instanceId', req)
    let userSecret = util.findInRequest('userSecret', req)

    let token, hasQueryState;
    if (req.elementKey && req.applicationId && userSecret) {
        req.uniqueName = util.findInRequest('uName', req) || util.findInRequest('uniqueName', req)
        req.application = await getApplication(req.applicationId)
        req.instanceId = util.findInRequest('instanceId', req)
        req.authData = {
            userSecret : userSecret,
            exp : util.findInRequest('exp', req),
            iat : util.findInRequest('iat', req),
            //already set, but need in authData too...
            applicationId : req.applicationId,
            orgSecret : req.application.orgSecret
        }

        next()
        return
    } else {
        if (req.body.state || req.body.code) {
            // restore all query parameter values from POST body so instance creation workflow works
            Object.keys(req.body).forEach(function (paramKey) {
                req.query[paramKey] = decodeURIComponent(req.body[paramKey])
            });
        }
        if (req.query.state && req.query.state === 'oauth1' && req.cookies.state) {
            hasQueryState = true;
            token = req.cookies.state

        } else if (!token && req.query.code && req.cookies.state) {
            hasQueryState = false
            req.query.state = req.cookies.state
            token = req.cookies.state
        }
    }
    if (!token) {
        res.status(401).send({ message: "Unauthorized, no userSecret or state found" })
    } else if (req.query.state && !req.body.state && !req.body.code) {
        // redirected from oauth -- need to render loading screen
        res.render(`load-create`)

    } else {
        res.clearCookie('state');
        if (req.body.state || req.body.code) {
            delete req.body
        }

        try {
            //process token from cookie
            req.authData = util.parseToken(token)
            req.elementKey = req.authData.elementKey
            req.uniqueName = req.authData.uName
            req.instanceId = req.authData.instanceId
            req.application = await getApplication(req.authData.applicationId)
            req.authData.orgSecret = req.application.orgSecret
            delete req.authData.elementKey
            delete req.authData.uName
            req.token = token
            next()
        } catch (err) {
            res.status(401)
            next(new Error(`The token is invalid, please re-launch the connector`))
        }
    }

}