/*
 * Copyright 2017 Vevox Digital under MIT License.
 */
'use strict'

const q = require('q')
const nconf = require('nconf')
const fs = require('fs-extra')
const path = require('path')

// const { Enum } = require('enumify')

exports.dirs = {
  root: path.join(__dirname, '..', '..'),
  src: path.join(__dirname, '..'),
  lib: __dirname
}

exports.app = require(path.join(exports.dirs.root, 'package.json'))
exports.cache = require(path.join(exports.dirs.lib, 'cache.js'))

const CONFIG_FILE = path.join(exports.dirs.root, 'config.json')

/* istanbul ignore next */
exports.initConfig = () => {
  const deferred = q.defer()

  nconf.file(CONFIG_FILE)
    .argv().env([ 'none' ]) // whitelist 'env' so 50+ things don't appear
    .defaults(exports.app.config)

  fs.writeFile(CONFIG_FILE, JSON.stringify(nconf.get(), null, 2), err => {
    if (err) return deferred.reject(err)
    nconf.file(CONFIG_FILE)
    exports.config = nconf

    q.nfcall(fs.stat, nconf.get('logs:dir')).then(() => {
      deferred.resolve()
    }).catch(err => {
      if (err.message.match(/^EEXIST/)) deferred.resolve(q.nfcall(fs.mkdir, nconf.get('logs:dir')))
      else deferred.reject(err)
    })
  })

  return deferred.promise
}

/* istanbul ignore next */
exports.saveConfig = () => {
  const deferred = q.defer()

  nconf.save(err => {
    if (err) return deferred.reject(err)
    deferred.resolve()
  })

  return deferred.promise
}
