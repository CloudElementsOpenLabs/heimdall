'use strict'

const { get } = require('./api')
const { find, propEq, prop, pipe, curry } = require('ramda')
const util = require('./utils')

const findAdditionalParams = curry((elementConfig, key) => pipe(find(propEq('oauthUrlParam', key)), prop('key'))(elementConfig))

module.exports = async (req, configuration, config) => {
    const getElementConfig = util.getConfigValue(config.properties)
    const findOauthParams = findAdditionalParams(config.properties)
    const state = util.createToken({
        userSecret: req.authData.userSecret,
        applicationId: req.authData.applicationId,
        elementKey: req.elementKey,
        configuration: configuration,
        uName: req.uniqueName,
        instanceId: req.instanceId
    })

    let payload = {
        apiKey: getElementConfig('oauth.api.key') ? getElementConfig('oauth.api.key') : configuration[findOauthParams('apiKey')],
        apiSecret: getElementConfig('oauth.api.secret') ? getElementConfig('oauth.api.secret') : configuration[findOauthParams('apiSecret')],
        callbackUrl: getElementConfig('oauth.callback.url') ? getElementConfig('oauth.callback.url') : configuration[findOauthParams('callbackUrl')],
        scope: getElementConfig('oauth.scope'),
        'authentication.type': getElementConfig('authentication.type')
    }
    // some elements use siteAddress normalization (zendesk, quickbooks, salesforce, desk, dynamicscrmadfs)
    // but some don't (servicenowoauth)
    // send both and let CE decide
    const subdomain = findOauthParams('siteAddress')
    payload.siteAddress = configuration[subdomain]
    payload[subdomain] = configuration[subdomain]

    const url = (await get(`elements/${req.elementKey}/oauth/url`, payload, req.authData)).oauthUrl
    return { url, state }
}