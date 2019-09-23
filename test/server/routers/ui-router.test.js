'use strict'

const puppeteer = require('puppeteer')
const path = require('path')
const { post, get, remove } = require('./http-request')
const { authorization, closeConnection } = require('./api-test')
const { BIG_COMMERCE, DESK, BOX, credentials} = require('./ui-router-mock-data')
const { POST_APPLICATION } = require('./api-router-mock-data')


jest.setTimeout(100 * 1000)
const instanceRegex = /"id": ([0-9]*), (.*?), "token": "(.*?)"/
const stagingUrl = 'https://heimdall-staging.cloud-elements.com/v1/api'
const stagingV2 = 'https://staging.cloud-elements.com/elements/api-v2'
const chromeHeadless = false

const initiateTest = async elementToken => {
    const browser = await puppeteer.launch({
        headless:chromeHeadless
    })

    const firstPage = await browser.newPage()
    await firstPage.goto(`file:${path.join(__dirname, 'index.html')}?token=${elementToken}`)
    const payloadChanged = firstPage.waitForFunction(() => document.getElementById('payload').innerText.length > 0, { polling: 5 * 1000, timeout: 60 * 1000 })
    await firstPage.waitForSelector('#connect')
  
    const newPage = new Promise( res => browser.on('targetcreated', res))
    await firstPage.click('#connect')
    await newPage
    const pages = await browser.pages()
    return { browser, startPage: pages[1], elementPage: pages[2], payloadChanged }
}

const getInstanceInfo = str => {
    try {
        const match = str.match(instanceRegex)
        return { id: Number(match[1]), token: match[3] }
    } catch (error) {
        console.log(error)
        return { id: 0, token: null}
    }
}

const teardownTestData = async(elementId, instanceId) => {
    await remove(`${stagingUrl}/elements/${elementId}`, authorization)
    await remove(`${stagingV2}/instances/${instanceId}`, authorization)
}

beforeAll(async () => {
    await post(`${stagingUrl}/applications`, POST_APPLICATION , authorization )
})

describe('BigCommerce Basic Auth', () => {
    let elementId, elementToken, instanceId

    beforeAll(async() => {
        const element = await post(`${stagingUrl}/elements`, BIG_COMMERCE , authorization)
        const response = await get(`${stagingUrl}/url`, {elementKey: element.key, uniqueName: element.name}, authorization)
        elementId = element.id
        elementToken = response.token
    })

    it('Test Basic Authentication and validate element token', async () => {
        let { browser, startPage, elementPage, payloadChanged } = await initiateTest(elementToken)
        try {
            await elementPage.waitForSelector('#password')
            await elementPage.focus('input[id=password]')
            await elementPage.type('input[id=password]', credentials.BIG_COMMERCE.password)
            await elementPage.focus('input[id=username]')
            await elementPage.type('input[id=username]', credentials.BIG_COMMERCE.username)
            await elementPage.focus('input[id="store.url"]')
            await elementPage.click('input[id="store.url"]', {clickCount: 3})
            await elementPage.type('input[id="store.url"]', credentials.BIG_COMMERCE.storeUrl)

            let isDisable = await elementPage.$('button[disabled]') !== null
            expect(isDisable).toBe(false)

            await elementPage.click('button[type=submit]')

            await payloadChanged
            let result = await startPage.evaluate(() => document.getElementById('payload').innerText)
            expect(result).toContain(`"name": "${BIG_COMMERCE.name}"`)
            expect(result).toContain('"token":')
            instanceId = getInstanceInfo(result).id
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
    let elementId, elementToken, instanceId

    beforeAll(async() => {
        const element = await post(`${stagingUrl}/elements`, DESK , authorization)
        const response = await get(`${stagingUrl}/url`, {elementKey: element.key, uniqueName: element.name}, authorization)
        elementId = element.id
        elementToken = response.token
    })

    it('Test Oauth 1 and validate element token', async () => {
        let { browser, startPage, elementPage, payloadChanged } = await initiateTest(elementToken)
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
            let result = await startPage.evaluate(() => document.getElementById('payload').innerText)
            expect(result).toContain(`"name": "${DESK.name}"`)
            expect(result).toContain('"token":')
            instanceId = getInstanceInfo(result).id
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
    let elementId, elementToken, instanceId

    beforeAll(async() => {
        const element = await post(`${stagingUrl}/elements`, BOX , authorization)
        const response = await get(`${stagingUrl}/url`, {elementKey: element.key, uniqueName: element.name}, authorization)
        elementId = element.id
        elementToken = response.token
    })

    it('Test Oauth 2 and validate element token', async () => {
        let { browser, startPage, elementPage, payloadChanged } = await initiateTest(elementToken)
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
            let result = await startPage.evaluate(() => document.getElementById('payload').innerText)
            expect(result).toContain(`"name": "${BOX.name}"`)
            expect(result).toContain('"token":')
            instanceId = getInstanceInfo(result).id
        } catch (error) {
            await browser.close()
            fail(error)
        }
        await browser.close()
    })

    afterAll(async () => {
        await teardownTestData(elementId, elementId)
    })
})

afterAll(() => {
    closeConnection()
})
