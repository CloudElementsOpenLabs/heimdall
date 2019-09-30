'use strict'
const winston = require('winston')
const { format, transports } = winston
const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.json()),
    defaultMeta: { node_env: process.env.NODE_ENV }
})

if (process.env.NODE_ENV === 'development') {
    logger.add(new transports.Console({
        format: format.combine(format.colorize(), format.prettyPrint(), format.simple()),
        handleExceptions: true,
        humanReadableUnhandledException: true,
        exitOnError: false
    }));
} else {
    logger.add(new transports.Console({
        handleExceptions: true,
        humanReadableUnhandledException: true,
        exitOnError: false
    }))
}

module.exports.logger = logger
