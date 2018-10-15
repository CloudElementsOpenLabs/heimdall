'use strict'

const { post, put } = require('./api');
const util = require('./utils')

module.exports = async (req, secret, config) => {
    const instance = {   
        name: `${req.elementKey}-${Date.now()}`,
        tags: [
            req.elementKey // tag instances w/ element key to filter out non-relevant instances when retrieving all instances for a data source
        ],
        element:{
            key: req.elementKey
        },
        providerData: {
            oauth_verifier: req.query.oauth_verifier,
            oauth_token: req.query.oauth_token,
            secret: secret
        },
        configuration: util.buildConfiguration(config.properties, req.authData.configuration),
    }

    if (req.uniqueName) { instance.name = req.uniqueName }

    if (req.instanceId) {
        return await put(`instances/${req.instanceId}`, instance, {
            userSecret: req.authData.userSecret, 
            orgSecret: req.authData.orgSecret
        })
    } else {
        return await post('instances', instance, {
            userSecret: req.authData.userSecret, 
            orgSecret: req.authData.orgSecret
        })
    }
}