'use strict'

const util = require('../src/utils')
const { applications } = require('../db/model')

const getApplication = async applicationId => {
    let application = await applications.findOne({ where: { id: applicationId }})
    if (application && application.orgSecret) {
        return application
    } else {
        throw new Error(`No application for for ID ${applicationId}`)
    }
}

module.exports = async (req, res, next) => {
    // if this is the basic auth callback
    if (req.body.instance) {
        res.render('send-result', JSON.stringify({id: req.body.instance.id, token: req.body.instance.token}))
    }

    if (req.query.token) {
        req.authData = util.parseToken(req.query.token)
        req.elementKey = req.authData.elementKey
        req.uniqueName = req.authData.uName
        req.application = await getApplication(req.authData.applicationId)  
        next()
        return
    }

    let token, hasQueryState;
    req.authData = {}
    req.application = {}
    if (req.query.elementKey && req.query.userSecret && req.query.applicationId) {
        req.elementKey = req.query.elementKey
        req.authData.userSecret = req.query.userSecret ? req.query.userSecret : req.body.userSecret
        req.application = await getApplication(req.query.applicationId)
        req.authData.orgSecret = req.application.orgSecret
        req.authData.applicationId = req.query.applicationId
        next()
        return
    } else if (req.body.elementKey && req.body.userSecret && req.body.applicationId) {
        req.elementKey = req.body.elementKey
        req.uniqueName = req.body.uniqueName
        req.authData.userSecret = req.body.userSecret
        req.application = await getApplication(req.body.applicationId)
        req.authData.orgSecret = req.application.orgSecret
        req.authData.applicationId = req.body.applicationId
        next()
        return
    } else {
        if(req.body.state || req.body.code) {
            // restore all query parameter values from POST body so instance creation workflow works
            Object.keys(req.body).forEach(function(paramKey) {
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
        res.status(401).send({message: "Unauthorized, no userSecret or state found"})
    } else if (req.query.state && !req.body.state && !req.body.code) { 
        // redirected from oauth -- need to render loading screen
        res.render(`load-create`)

    } else {
        res.clearCookie('state');
        if (req.body.state || req.body.code) {
            delete req.body
        }

        try {
            req.authData = util.parseToken(token)
            req.elementKey = req.authData.elementKey
            req.uniqueName = req.authData.uName
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