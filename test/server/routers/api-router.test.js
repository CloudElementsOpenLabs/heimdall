'use strict'

const request = require('supertest')
const apiRouter = require('../../../server/routers/api-router')
const express = require('express')
const bodyParser = require('body-parser')
const model = require('../../../db/model')
const mocks = require('./api-router-mock-data')

const server = express()
server.use(bodyParser.json())
server.use(bodyParser.urlencoded())
server.use(apiRouter)
server.use(require('../../../server/errorCatcher'))
jest.setTimeout(30000)

let authorization;
let authUser;
let authOrg;

beforeAll(() => {
  authUser = process.env.TEST_USER_SECRET
  authOrg = process.env.TEST_ORG_SECRET
  console.log(authOrg)
  authorization = `User ${authUser}, Organization ${authOrg}`
  model.applications.destroy({
      where: {
          orgSecret: authOrg
      }
    })
})

afterAll(() => {
  model.closeConnection()
})

describe('Applications Integration Tests', () => {

  test('POST Applications - Create a new Application', async () => {
    const response = await request(server)
    .post('/applications')
    .send(mocks.POST_APPLICATION(authOrg))
    .set('Authorization', authorization)
    .set('Content-Type', 'application/json')
    
    expect(response.status).toBe(200)
    expect(response.body.orgSecret).toBe(authOrg)
  })

  test('POST Applications - Validate not being able to post another application', async () => {
    const response = await request(server)
    .post('/applications')
    .send(mocks.POST_APPLICATION(authOrg))
    .set('Authorization', authorization)
    .set('Content-Type', 'application/json')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Validation error')
  })

  test('GET Applications - Get all the applications for a organization secret', async () => {
    const response = await request(server)
    .get('/applications')
    .set('Authorization', authorization)
    .set('Content-Type', 'application/json')

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBe(1)
    expect(response.body[0].orgSecret).toBe(authOrg)
  })

  test('PUT Applications - Update an application', async () => {
    const response = await request(server)
    .put('/applications')
    .send(mocks.PUT_APPLICATION)
    .set('Authorization', authorization)
    .set('Content-Type', 'application/json')

    expect(response.status).toBe(200)
    expect(response.body.orgSecret).toBe(authOrg)
    expect(response.body.helpUrl).toBeNull()
    expect(response.body.logoUrl).toBe(mocks.PUT_APPLICATION.logoUrl)
  })
})

describe('Elements Integration Tests', () => {
    let elementId;

    test('POST Elements - Creates a new element', async () => {
        const response = await request(server)
        .post('/elements')
        .send(mocks.POST_ELEMENT)
        .set('Authorization', authorization)
        .set('Content-Type', 'application/json')

        elementId = response.body.id
        expect(response.status).toBe(200)
        expect(response.body.name).toBe(mocks.POST_ELEMENT.name)
        expect(response.body.properties.length).toBe(3)
    })

    test('GET Elements - Get an element by id', async () => {
        const response = await request(server)
        .get(`/elements/${elementId}`)
        .set('Authorization', authorization)
        .set('Content-Type', 'application/json')

        expect(response.status).toBe(200)
        expect(response.body.key).toBe(mocks.POST_ELEMENT.key)

        const newResponse = await request(server)
        .get(`/elements/0`)
        .set('Authorization', authorization)
        .set('Content-Type', 'application/json')

        expect(newResponse.status).toBe(404)
        expect(newResponse.body.message).toBe('Record with provided ID not found')
    })

    test('PUT Elements - Updates an Element', async () => {
        const response = await request(server)
        .put(`/elements/${elementId}`)
        .send(mocks.PUT_ELEMENT(elementId))
        .set('Authorization', authorization)
        .set('Content-Type', 'application/json')

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(elementId)
        expect(response.body.properties.length).toBe(3)
        let property = response.body.properties.find(p => p.dataType === 'picklist')
        expect(property.elementId).toBe(elementId)
        expect(property.picklistOptions.length).toBe(2)
    })

    test('DELETE Elements - Delete an element', async () => {
        const response = await request(server)
        .delete(`/elements/${elementId}`)
        .set('Authorization', authorization)
        .set('Content-Type', 'application/json')

        expect(response.status).toBe(200)
    })
    
})
