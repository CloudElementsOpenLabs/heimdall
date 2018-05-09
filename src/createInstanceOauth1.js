'use strict'

const {post} = require('./api');
const util = require('./utils')

module.exports = async (sourceName, uniqueName, state, query, secret, config) => {
    const instance = {   
        name: `${sourceName}-${Date.now()}`,
        tags: [
            sourceName // tag instances w/ element key to filter out non-relevant instances when retrieving all instances for a data source
        ],
        element:{
            key: sourceName
        },
        providerData: {
            oauth_verifier: query.oauth_verifier,
            oauth_token: query.oauth_token,
            secret: secret
        },
        configuration: util.buildConfiguration(config.properties, state.configuration),
    }

    if (uniqueName) { instance.name = uniqueName }

    return await post('instances', instance, {
        userSecret: state.userSecret, 
        orgSecret: state.orgSecret
    })
}