'use strict'

module.exports = async (sourceName, authData) => {
    try {
        return await require(`./username/${sourceName}`)(authData)
    } catch (err) { 
        return null
    }
}

