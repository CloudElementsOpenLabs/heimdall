'use strict'

const express = require('express')
const ui = express.Router()
const util = require('../../src/utils')
const uiAuthentication = require('../uiAuthentication')
const asyncErrorCatcher = require('../asyncErrorCatcher')
const oauthUrl = require('../../src/oauthUrl')
const oauth1Url = require('../../src/oauth1Url')
const createInstanceBasic = require('../../src/createInstanceBasic')
const createInstanceOauth = require('../../src/createInstanceOauth')
const createInstanceOauth1 = require('../../src/createInstanceOauth1')
const getElement = require('../../src/getElement')
const sendNotification = require('../../src/sendNotification')

ui.all(/^\/(?!public).*/, uiAuthentication)

ui.all('/application', asyncErrorCatcher(async (req, res, next) => {

    const config = await getElement(req.elementKey, req.authData.applicationId)
    let isOAuthRedirect = !(req.query.state === undefined)
    let instance

    // oAuth redirect logic
    if (isOAuthRedirect) {
        if (config.authType === 'oauth2') {
            if (req.query.code) {
                try {
                    req.authData.realmId = req.query.realmId
                    instance = await createInstanceOauth(req, req.query.code, config)
                    res.send(instance)
                    req.application.notificationEmail ? sendNotification(req.application.notificationEmail, instance) : null
                    return
                    //successfully created oauth instance
                } catch (error) {
                    //handle failed oauth in errorCatcher
                    throw error
                }
            } else {
                //handle failed oauth in errorCatcher
                throw error
            }
        } else if (config.authType === 'oauth1') {
            if (req.query.oauth_token && req.query.oauth_verifier) {
                try {
                    instance = await createInstanceOauth1(req, req.cookies.secret, config)
                    res.send(instance)
                    req.application.notificationEmail ? sendNotification(req.application.notificationEmail, instance) : null
                    return
                } catch (error) {
                //handle failed oauth in errorCatcher
                throw error

                }
            } else {
                //handle failed oauth in errorCatcher
                throw error
            }
        }
    }

    if (!isOAuthRedirect) {

        if (util.needsUserConfig(config.properties)) {
            let data = {
                config: config,
                cssUrl: req.application.cssUrl ? req.application.cssUrl : 'public/stylesheets/style.css',
                helpUrl: req.application.helpUrl,
                logoUrl: req.application.logoUrl,
                applicationId: req.authData.applicationId,
                elementKey: req.elementKey,
                uniqueName: req.uniqueName,
                instanceId: req.instanceId
            }
            // don't put userSecret on the page if using a heimdall token
            let method = req.query.token ? { token: req.query.token } : { userSecret: req.authData.userSecret }
            //return instance create page
            res.render(`create-${config.authType}`, Object.assign(data, method))

        } else {
            // redirect to source authorization page directly
            const { url, state } = await oauthUrl(req, {}, config)
            res.cookie('state', state)
            res.redirect(url)
        }
    }
}))

ui.post('/instances', asyncErrorCatcher(async (req, res, next) => {
    const config = await getElement(req.elementKey, req.authData.applicationId)
    if (config.authType === 'oauth2') {
        //oauth2 had visible fields requiring user input
        const { url, state } = await oauthUrl(req, req.body, config)
        res.cookie('state', state)
        res.redirect(url)
    } else if (config.authType === 'oauth1') {
        let urlAndSecret = await oauth1Url(req, req.body, config)
        res.cookie('secret', urlAndSecret.secret)
        res.cookie('state', urlAndSecret.state)
        res.redirect(urlAndSecret.url)
    } else {
        let instance = await createInstanceBasic(req, req.body, config)
        res.send(instance)
        req.application.notificationEmail ? sendNotification(req.application.notificationEmail, instance) : null
    }
}))

module.exports = ui
