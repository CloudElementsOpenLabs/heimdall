'use strict'

const {post} = require('./api');
const {curry, pipe, find, propEq, prop} = require('ramda')
const util = require('./utils')

module.exports = async (sourceName, uniqueName, props, authData, config) => {
    const instance = {   
        name: `${sourceName}-${Date.now()}`,
        tags: [
            sourceName // tag instances w/ element key to filter out non-relevant instances when retrieving all instances for a data source
        ],
        element:{
            key: sourceName 
        },
        configuration: util.buildConfiguration(config.properties, props)    
    }

    if (uniqueName) {
        instance.name = uniqueName
    }

    let result = await post('instances', instance, authData)
    return result
}