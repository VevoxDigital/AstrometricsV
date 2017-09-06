/*
 * Copyright 2017 Vevox Digital under the MIT License.
 */
'use strict'

const path = require('path')
const mongoose = require('mongoose')
const q = require('q')

global.App = { util: require(path.join(__dirname, 'src', 'lib', 'util')) }

// start by loading app config
App.util.initConfig().then(() => {
  App.log = require(path.join(App.util.dirs.lib, 'logger'))

  App.log.info('configuration loaded, trying to connect to database...')
  App.log.dumpError = err => { App.log.error(`${err.message}: \n ${err.stack}`) }
  // config successfully loaded

  const c = App.util.config
  const options = {
    user: c.get('database:auth:username'),
    pass: c.get('database:auth:password'),
    useMongoClient: true
  }
  if (!options.pass.length) {
    delete options.user
    delete options.pass
  }
  const uri = `${c.get('database:type')}://${c.get('database:host')}:${c.get('database:port')}/${c.get('database:database')}`
  App.log.info(`connecting to <${uri}> with ${options.user ? 'username ' + options.user : 'no auth'}`)
  mongoose.Promise = q.Promise
  mongoose.connect(uri, options).then(() => {
    // database connection was successful
    App.log.info('conneced to database successfully')

    // PAUSE
  }).catch(err => {
    App.log.error('failed to connect to the database')
    App.log.dumpError(err)
  }).done()
}).catch(err => {
  console.error('failed to initialize config')
  console.error(err)
}).done()
