'use strict'

const Op = require('sequelize')
const model = require('./model')

module.exports = {
    elementInclude: {
        model: model.properties,
        include: [model.picklistOptions],
    },
    findElements: applicationId => ({
        include: module.exports.elementInclude, 
        where: { 
            applicationId: applicationId 
        } 
    }),
    retrieveElement: (applicationId, elementId) => ({
        rejectOnEmpty: true, 
        include: module.exports.elementInclude, 
        where: { 
            id: elementId , 
            applicationId: applicationId
        } 
    }),
    updateElement: (applicationId, elementId) => ({
        rejectOnEmpty: true, 
        where: { 
            id: elementId , 
            applicationId: applicationId
        } 
    }),
    retrieveApplication: orgSecret => ({
        rejectOnEmpty: true, 
        where: {
            orgSecret: orgSecret
        }
    }),
    applyDefaultValues: (entity, schemaIdentifier) => {
        let schema = model[schemaIdentifier]
        if(!schema) {
            throw new Error("Invalid Schema Identifier.")
        }
        for (let prop in schema) {
            if (!(prop in entity)) {
                entity[prop] = schema[prop].defaultValue
            }
        }
        return entity
    }
}
