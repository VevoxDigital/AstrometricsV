/*
 * Copyright 2017 Vevox Digital under the MIT License.
 */
'use strict'

require('colors')

const winston = require('winston')
const path = require('path')
require('winston-daily-rotate-file')

let logDir = path.join(App.util.dirs.root, App.util.config.get('logs:dir'))

exports = module.exports = new winston.Logger({
  transports: [

    // verbose console output
    new winston.transports.Console({
      level: 'verbose',
      colorize: true
    }),

    // info files rotate daily
    new winston.transports.DailyRotateFile({
      name: 'info-file',
      filename: logDir + '/info-',
      datePattern: 'yy-MM-dd.log',
      level: 'info',
      json: false
    }),

    // error files rotate once a month
    new winston.transports.DailyRotateFile({
      name: 'error-file',
      filename: logDir + '/errors-',
      datePattern: 'yy-MM.log',
      level: 'warn',
      json: false
    })
  ]
})
