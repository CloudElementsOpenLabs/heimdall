'use strict'

const { post } = require('./api');
const util = require('./utils')

module.exports = async (sourceName, uniqueName, state, code, config) => {
    const instance = {   
        name: `${sourceName}-${Date.now()}`,
        tags: [
            sourceName // tag instances w/ element key to filter out non-relevant instances when retrieving all instances for a data source
        ],
        element:{
            key: sourceName
        },
        providerData: {
            code: code
        },
        configuration: util.buildConfiguration(config.properties, state.configuration),
    }

    if (uniqueName) { instance.name = uniqueName }

    if (state.realmId) { instance.providerData.realmId = state.realmId }

    return await post('instances', instance, {
        userSecret: state.userSecret, 
        orgSecret: state.orgSecret
    })
}