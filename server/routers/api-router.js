'use strict'

const express = require('express')
const api = express.Router()
const util = require('../../src/utils')
const asyncErrorCatcher = require('../asyncErrorCatcher')
const apiAuthentication = require('../apiAuthentication')
const getElement = require('../../src/getElement')
const model = require('../../db/model')
const query = require('../../db/query')
const R = require('ramda')

api.all('*', apiAuthentication)

api.get('/elements', asyncErrorCatcher(async (req, res) => {
    res.send(await model.elements.findAll(query.findElements(req.authData.applicationId)))
}))

api.post('/elements', asyncErrorCatcher(async (req, res) => {
    req.body.applicationId = req.authData.applicationId
    res.send(await model.elements.create(req.body, { include: query.elementInclude }))
}))

api.get('/elements/:id', asyncErrorCatcher(async (req, res) => {
    res.send(await model.elements.findOne(query.retrieveElement(req.authData.applicationId, req.params.id)))
}))

api.put('/elements/:id', asyncErrorCatcher(async (req, res) => {
    await model.elements.update(req.body, query.updateElement(req.authData.applicationId, req.params.id))
    await model.properties.destroy({ where: { elementId: req.params.id} })
    await Promise.all(R.map(async property => await model.properties.create(property, { include: [model.picklistOptions] }))(req.body.properties))
    res.send(await model.elements.findOne(query.retrieveElement(req.authData.applicationId, req.params.id)))
}))

api.delete('/elements/:id', asyncErrorCatcher(async (req, res) => {
    await model.elements.findOne(query.retrieveElement(req.authData.applicationId, req.params.id))
    await model.elements.destroy(query.retrieveElement(req.authData.applicationId, req.params.id))
    res.send()
}))

api.get('/applications', asyncErrorCatcher(async (req, res) => {
    res.send(await model.applications.findAll(query.retrieveApplication(req.authData.orgSecret)))
}))

api.post('/applications', asyncErrorCatcher(async (req, res) => {
    let application = req.body
    application.orgSecret = req.authData.orgSecret
    res.send(await model.applications.create(application))
}))

api.put('/applications', asyncErrorCatcher(async (req, res) => {
    let application = req.body
    application.orgSecret = req.authData.orgSecret
    
    await model.applications.update(query.applyDefaultValues(application,model.schemaIdentifiers.application), {
        where: { orgSecret: req.authData.orgSecret }
    })
    res.send(await model.applications.findOne(query.retrieveApplication(req.authData.orgSecret)))
}))

api.get('/url', asyncErrorCatcher(async (req, res) => {
    if (!req.query.elementKey) {
        res.status(400).send({message: "Must provide elementKey"})
        return
    }
    try {
        await getElement(req.query.elementKey, req.authData.applicationId)
    } catch (err) {
        res.status(404).send({message: `No configuration found for elementKey ${req.query.elementKey}`})
        return
    }
    let token = util.createToken({
        userSecret: req.authData.userSecret,
        applicationId: req.authData.applicationId,
        elementKey: req.query.elementKey, 
        uName: req.query.uniqueName,
        instanceId: req.query.instanceId
    })
    res.send({url: `${process.env.BASE_URL}/v1/application?token=${token}`, token: token})
}))

module.exports = api
