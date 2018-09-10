'use strict'

//TODO: re write all of this, make it not suck
const express = require('express')
const ui = express.Router()
const { remove } = require('../../src/api')
const util = require('../../src/utils')
const uiAuthentication = require('../uiAuthentication')
const asyncErrorCatcher = require('../asyncErrorCatcher')
const oauthUrl = require('../../src/oauthUrl')
const oauth1Url = require('../../src/oauth1Url')
const getInstance = require('../../src/getInstanceHealthy')
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
    let elementKey = req.query.elementKey

    // oAuth redirect logic
    if (isOAuthRedirect) {
        instance = await getInstance(elementKey, req.authData)
        await deleteExistingInstances(req.authData, instance)
        delete req.authData.elementToken
        if (config.authType === 'oauth2') {
            if (req.query.code) {
                try {
                    req.authData.realmId = req.query.realmId
                    instance = await createInstanceOauth(req.elementKey, req.uniqueName, req.authData, req.query.code, config)
                    res.send(instance)
                    await sendNotification(req.application.notificationEmail, instance)
                    return
                    //successfully created oauth instance
                } catch (error) {
                    // oAuth authentication failure -- delete any existing instances to prevent phishing attacks using stolen 'state'
                    await handleFailedOauth(elementKey, req)
                }
            } else {
                // oAuth authentication failure -- delete any existing instances to prevent phishing attacks using stolen 'state'
                await handleFailedOauth(elementKey, req)
            }
        } else if (config.authType === 'oauth1') {
            if (req.query.oauth_token && req.query.oauth_verifier) {
                try {
                    instance = await createInstanceOauth1(req.elementKey, req.uniqueName, req.authData, req.query, req.cookies.secret, config)
                    res.send(instance)
                    await sendNotification(req.application.notificationEmail, instance)
                    return
                } catch (error) {
                    await handleFailedOauth(elementKey, req)
                }
            } else {
                // oAuth authentication failure -- delete any existing instances to prevent phishing attacks using stolen 'state'
                await handleFailedOauth(elementKey, req)
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
                uniqueName: req.uniqueName  
            }
            // don't put userSecret on the page if using a heimdall token
            let method = req.query.token ? { token: req.query.token } : { userSecret: req.authData.userSecret}
            //return instance create page
            res.render(`create-${config.authType}`, Object.assign(data, method))
            
        } else {
            // redirect to source authorization page directly
            const { url, state } = await oauthUrl(req.elementKey, req.uniqueName, {}, req.authData, config)
            res.cookie('state', state)
            res.redirect(url)
        }
    }
}))

ui.post('/instances', asyncErrorCatcher(async (req, res, next) => {
    const config = await getElement(req.elementKey, req.authData.applicationId)
    if (config.authType === 'oauth2') {
        const { url, state } = await oauthUrl(req.cookies.elementKey, req.uniqueName, req.body, req.authData)
        res.cookie('state', state)
        res.redirect(url)
    } else if (config.authType === 'oauth1') {
        let urlAndSecret = await oauth1Url(req.elementKey, req.uniqueName, req.body, req.authData, config)
        res.cookie('secret', urlAndSecret.secret)
        res.cookie('state', urlAndSecret.state)
        res.redirect(urlAndSecret.url)
    } else {
        let instance = await createInstanceBasic(req.elementKey, req.uniqueName, req.body, req.authData, config)
        res.send(instance)
        await sendNotification(req.application.notificationEmail, instance)
    }
}))

const deleteExistingInstances = async (authData, instances) => {
    while (instances.length > 0) {
        await remove(`/instances`, {
            userSecret: authData.userSecret,
            orgSecret: authData.orgSecret,
            elementToken: instances[0].token
        })
        instances.shift()
        console.log('deleted existing instance')
    }
}

const handleFailedOauth = async (elementKey, req) => {
    console.log('invalid oAuth code -- reauthenticate')
    const instance = await getInstance(elementKey, req.authData)
    await deleteExistingInstances(req.authData.userSecret, instance);
    delete req.authData.elementToken
}

module.exports = ui
