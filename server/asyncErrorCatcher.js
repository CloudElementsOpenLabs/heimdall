'use strict'
  // consolidate async errors with catch.next(err) to invoke error handling middleware
module.exports = fn => {
    return (req, res, next) => fn(req, res, next).catch(next)
}