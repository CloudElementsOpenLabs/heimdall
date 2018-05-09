'use strict'

//https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb

const crypto = require('crypto')
const eKey = process.env.SECRET_KEY // Must be 256 bytes (32 characters)
const ivLen = 16 // For AES, this is always 16

const encrypt = text => {
  let iv = crypto.randomBytes(ivLen)
  let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(eKey), iv)
  let encrypted = cipher.update(text)

  encrypted = Buffer.concat([encrypted, cipher.final()])

   return iv.toString('hex') + ':' + encrypted.toString('hex')
}

const decrypt = text =>  {
  let textParts = text.split(':')
  let iv = new Buffer(textParts.shift(), 'hex')
  let encryptedText = new Buffer(textParts.join(':'), 'hex')
  let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(eKey), iv)
  let decrypted = decipher.update(encryptedText)

  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

module.exports = { decrypt, encrypt }