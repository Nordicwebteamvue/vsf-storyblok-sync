import { Router } from 'express'
import crypto from 'crypto'
import StoryblokClient from 'storyblok-js-client'
import { apiStatus } from '../../../lib/util'
import { hook } from './hook'
import { syncStories } from './sync-stories'

const log = (string) => {
  console.log('📖 : ' + string) // eslint-disable-line no-console
}

module.exports = ({ config, db }) => {
  if (!config.storyblok || !config.storyblok.previewToken) {
    throw new Error('🧱 : config.storyblok.previewToken not found')
  }

  const storyblokClientConfig = {
    accessToken: config.storyblok.previewToken,
    cache: {
      type: 'memory'
    }
  }

  const storyblokClient = new StoryblokClient(storyblokClientConfig)
  const index = 'storyblok_stories'
  const api = Router()

  api.use(hook({ config, db, index, storyblokClient }))

  const getStory = (res, path) => db.search({
    index,
    type: 'story',
    body: {
      query: {
        constant_score: {
          filter: {
            bool: {
              should: [{
                term: {
                  'full_slug.keyword': path
                }
              }, {
                term: {
                  'full_slug.keyword': `${path}/`
                }
              }]
            }
          }
        }
      }
    }
  }).then((response) => {
    const { hits } = response
    if (hits.total > 0) {
      let story = hits.hits[0]._source
      if (typeof story.content === 'string') {
        story.content = JSON.parse(story.content)
      }
      apiStatus(res, {
        story
      })
    } else {
      apiStatus(res, {
        story: false
      }, 404)
    }
  }).catch(() => {
    apiStatus(res, {
      story: false
    }, 500)
  })

  db.ping({
    requestTimeout: 30000
  }).then(async (response) => {
    try {
      log('Syncing published stories!')
      await db.indices.delete({ ignore_unavailable: true, index })
      await db.indices.create({
        index,
        body: {
          index: {
            mapping: {
              total_fields: {
                limit: config.storyblok.fieldLimit || 1000
              }
            }
          }
        }
      })
      await syncStories({ db, index, perPage: config.storyblok.perPage, storyblokClient })
      log('Stories synced!')
    } catch (error) {
      log('Stories not synced!')
    }
  }).catch(() => {
    log('Stories not synced!')
  })

  api.get('/story(/?*)', ({ params: { [1]: path } }, res) => {
    getStory(res, path)
  })

  api.get('/validate-editor', async (req, res) => {
    const { spaceId, timestamp, token } = req.query

    const validationString = `${spaceId}:${config.storyblok.previewToken}:${timestamp}`
    const validationToken = crypto.createHash('sha1').update(validationString).digest('hex')

    // TODO: Give different error if timestamp is old
    if (token === validationToken && timestamp > Math.floor(Date.now() / 1000) - 3600) {
      return apiStatus(res, {
        previewToken: config.storyblok.previewToken,
        error: false
      })
    }

    return apiStatus(res, {
      error: 'Unauthorized editor'
    }, 403)
  })

  return api
}
