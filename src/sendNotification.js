'use strict'

const { post } = require('./api')
const authData = {
    userSecret: process.env.SENDGRID_USER,
    orgSecret: process.env.SENDGRID_ORG,
    elementToken: process.env.SENDGRID_TOKEN
} 

module.exports = async (email, instance) => {
    const message = {
        to: email,
        subject: `Connection Authorized for ${instance.name}`,
        from: 'notifications@cloud-elements.com',
        message: `A user has authorized a connection to ${instance.element.name}. \n
        The following element instance has been created: ${instance.name}`
    }
    try {
        let response = await post('messages', message, authData)
    } catch (err) {
        console.error("Failed to send email notification", err)
    }
}