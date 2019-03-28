'use strict'

const config = require('config')
const common = require('./.common')
const createIndex = require('../src/lib/elastic').createIndex

module.exports.up = function (next) {
  const indexPrefix = config.storyblok.indexPrefix || ''
  const index = indexPrefix + 'stories'
  createIndex(common.db, index, () => {
    common.db.indices.putMapping({
      index,
      type: 'object',
      body: {
        properties: {
          slug: { type: 'string' },
          content: { type: 'object' },
          language: { type: 'text' },
          name: { type: 'string' },
          id: { type: 'integer' },
          parent_id: { type: 'integer' }
        }
      }
    }).then(() => next())
  })
}

module.exports.down = function (next) {
  next()
}
