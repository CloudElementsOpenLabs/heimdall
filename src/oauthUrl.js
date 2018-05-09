'use strict'

const {get} = require('./api')
const {find, propEq, prop, pipe, curry} = require('ramda')
const util = require('./utils')

const findAdditionalParams = curry((elementConfig, key) => pipe(find(propEq('oauthUrlParam', key)), prop('key'))(elementConfig))

module.exports = async (elementKey, uniqueName, configuration, authData, config) => {
    const getElementConfig = util.getConfigValue(config.properties)
    const findOauthParams = findAdditionalParams(config.properties)
    const state = util.createToken({
        userSecret: authData.userSecret,
        applicationId: authData.applicationId,
        elementKey: elementKey, 
        configuration: configuration,
        uName: uniqueName
    })

    let url = (await get(`elements/${elementKey}/oauth/url`,
        {
            apiKey: getElementConfig('oauth.api.key') ? getElementConfig('oauth.api.key') : configuration[findOauthParams('apiKey')],
            apiSecret: getElementConfig('oauth.api.secret') ? getElementConfig('oauth.api.secret') : configuration[findOauthParams('apiSecret')],
            callbackUrl: getElementConfig('oauth.callback.url') ? getElementConfig('oauth.callback.url') : configuration[findOauthParams('callbackUrl')],
            siteAddress: configuration[findOauthParams('siteAddress')],
            scope: getElementConfig('oauth.scope'),
            'authentication.type': getElementConfig('authentication.type'),
        }, authData)).oauthUrl
    return { url, state }
}