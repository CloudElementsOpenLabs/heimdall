'use strict'

const puppeteer = require('puppeteer')
const path = require('path')
const { post, get, remove } = require('./http-request')
const { BIG_COMMERCE, DESK, BOX, credentials } = require('./ui-router-mock-data')
const { POST_APPLICATION } = require('./api-router-mock-data')
const authHeader = require('../../../src/authHeader')
    ({
        orgSecret: process.env.TEST_ORG_SECRET,
        userSecret: process.env.TEST_USER_SECRET
    })

jest.setTimeout(100 * 1000)
const instanceRegex = /"id": ([0-9]*), (.*?), "token": "(.*?)"/
const urlHeimdall = 'https://heimdall-staging.cloud-elements.com/v1/api'
const urlCloudElements = 'https://staging.cloud-elements.com/elements/api-v2'
const chromeHeadless = false

const initiateTest = async heimdallToken => {
    const browser = await puppeteer.launch({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless: chromeHeadless
    })

    const firstPage = await browser.newPage()
    await firstPage.goto(`file:${path.join(__dirname, 'index.html')}?token=${heimdallToken}`)
    const payloadChanged = firstPage.waitForFunction(() => testResult, { polling: 5 * 1000, timeout: 0 })
    await firstPage.waitForSelector('#connect')

    const newPage = new Promise(res => browser.on('targetcreated', res))
    await firstPage.click('#connect')
    await newPage
    const pages = await browser.pages()
    return { browser, startPage: pages[1], elementPage: pages[2], payloadChanged }
}

const teardownTestData = async (elementId, instanceId) => {
    await remove(`${urlHeimdall}/elements/${elementId}`, authHeader)
    await remove(`${urlCloudElements}/instances/${instanceId}`, authHeader)
}

beforeAll(async () => {
    const applications = await get(`${urlHeimdall}/applications/`, null, authHeader)
    if (applications.length === 0)
        await post(`${urlHeimdall}/applications`, POST_APPLICATION, authHeader)
})

describe('BigCommerce Basic Auth', () => {
    let elementId, heimdallToken, instanceId

    beforeAll(async () => {
        const element = await post(`${urlHeimdall}/elements`, BIG_COMMERCE, authHeader)
        const response = await get(`${urlHeimdall}/url`, { elementKey: element.key, uniqueName: element.name }, authHeader)
        elementId = element.id
        heimdallToken = response.token
    })

    it('Test Basic Authentication and validate element token', async () => {
        let { browser, startPage, elementPage, payloadChanged } = await initiateTest(heimdallToken)
        try {
            await elementPage.waitForSelector('#password')
            await elementPage.focus('input[id=password]')
            await elementPage.type('input[id=password]', credentials.BIG_COMMERCE.password)
            await elementPage.focus('input[id=username]')
            await elementPage.type('input[id=username]', credentials.BIG_COMMERCE.username)
            await elementPage.focus('input[id="store.url"]')
            await elementPage.click('input[id="store.url"]', { clickCount: 3 })
            await elementPage.type('input[id="store.url"]', credentials.BIG_COMMERCE.storeUrl)

            let isDisable = await elementPage.$('button[disabled]') !== null
            expect(isDisable).toBe(false)

            await elementPage.click('button[type=submit]')

            await payloadChanged
            let result = await startPage.evaluate(() => testResult)
            expect(result.name).toEqual(BIG_COMMERCE.name)
            expect(result).toHaveProperty('token')
            instanceId = result.id
        } catch (error) {
            await browser.close()
            fail(error)
        }
        await browser.close()
    })

    afterAll(async () => {
        await teardownTestData(elementId, instanceId)
    })
})

describe('Desk.com Oauth 1', () => {
    let elementId, heimdallToken, instanceId

    beforeAll(async () => {
        const element = await post(`${urlHeimdall}/elements`, DESK, authHeader)
        const response = await get(`${urlHeimdall}/url`, { elementKey: element.key, uniqueName: element.name }, authHeader)
        elementId = element.id
        heimdallToken = response.token
    })

    it('Test Oauth 1 and validate element token', async () => {
        let { browser, startPage, elementPage, payloadChanged } = await initiateTest(heimdallToken)
        try {
            await elementPage.waitForSelector('#subdomain')
            await elementPage.focus('input[id=subdomain]')
            await elementPage.type('input[id=subdomain]', credentials.DESK.subdomain)

            let isDisable = await elementPage.$('button[disabled]') !== null
            expect(isDisable).toBe(false)
            await elementPage.click('button[type=submit]')

            await elementPage.waitForSelector('#user_session_email')
            await elementPage.focus('input[id=user_session_email]')
            await elementPage.type('input[id=user_session_email]', credentials.DESK.username)
            await elementPage.focus('input[id=user_session_password]')
            await elementPage.type('input[id=user_session_password]', credentials.DESK.password)

            await elementPage.click('input[type=submit]')
            await elementPage.waitForSelector('input[name=commit]')
            await elementPage.click('input[type=submit]')

            await payloadChanged
            let result = await startPage.evaluate(() => testResult)
            expect(result.name).toEqual(DESK.name)
            expect(result).toHaveProperty('token')
            instanceId = result.id
        } catch (error) {
            await browser.close()
            fail(error)
        }
        await browser.close()
    })

    afterAll(async () => {
        await teardownTestData(elementId, instanceId)
    })
})

describe('Box Oauth 2', () => {
    let elementId, heimdallToken, instanceId

    beforeAll(async () => {
        const element = await post(`${urlHeimdall}/elements`, BOX, authHeader)
        const response = await get(`${urlHeimdall}/url`, { elementKey: element.key, uniqueName: element.name }, authHeader)
        elementId = element.id
        heimdallToken = response.token
    })

    it('Test Oauth 2 and validate element token', async () => {
        let { browser, startPage, elementPage, payloadChanged } = await initiateTest(heimdallToken)
        try {
            await elementPage.waitForSelector('#login')
            await elementPage.focus('input[id=login]')
            await elementPage.type('input[id=login]', credentials.BOX.username)
            await elementPage.focus('input[id=password]')
            await elementPage.type('input[id=password]', credentials.BOX.password)

            await elementPage.click('input[type=submit]')
            await elementPage.waitForSelector('button[id=consent_accept_button]')
            await elementPage.click('button[id=consent_accept_button]')

            await payloadChanged
            let result = await startPage.evaluate(() => testResult)
            expect(result.name).toEqual(BOX.name)
            expect(result).toHaveProperty('token')
            instanceId = result.id
        } catch (error) {
            await browser.close()
            fail(error)
        }
        await browser.close()
    })

    afterAll(async () => {
        await teardownTestData(elementId, instanceId)
    })
})