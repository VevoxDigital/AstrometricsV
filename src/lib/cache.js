/*
 * Copyright 2017 Vevox Digital under the MIT License.
 */
'use strict'

const q = require('q')

let redis
try {
  redis = require('redis')
} catch (e) { }

// attempts to connect to the cache, or just resolves if disabled
exports.connect = () => {
  if (redis) {
    const deferred = q.defer()

    const c = App.util.config
    const client = redis.createClient({
      host: c.get('cache:host'),
      port: c.get('cache:port'),
      db: c.get('cache:database'),
      password: c.get('cache:auth:password').length ? c.get('cache:auth:password') : undefined
    })

    client.on('ready', () => {
      App.log.info('cache is ready to be used')
      deferred.resolve()
    })

    client.on('error', err => {
      App.log.error('[cache] ' + err.message)
      deferred.reject(err)
    })

    return deferred.promise
  } else {
    App.log.info('cache optional dependency is not installed and will not be used')
    return q.resolve()
  }
}

exports.enabled = () => {
  return !!redis
}
