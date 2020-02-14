import { Router } from 'express'
import crypto from 'crypto'
import StoryblokClient from 'storyblok-js-client'
import { apiStatus } from '../../../lib/util'
import { hook } from './hook'
import { fullSync, log } from './fullSync'
import cacheFactory from './cache'

const fetchStory = async (res, storyblokClient, path) => {
  const cv = Date.now() // bust cache
  try {
    const { data } = await storyblokClient.get(`cdn/stories/${path}`, {
      cv,
      resolve_links: 'url'
    })
    data.skippedElasticSearch = true
    data.cv = cv
    apiStatus(res, data)
  } catch (error) {
    console.log('error', error)
    apiStatus(res, {story: false, skippedElasticSearch: true}, 404)
  }
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
  const cache = cacheFactory(config)

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
            term: {
              'full_slug.keyword': path
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

  if (!config.storyblok.skipElasticsearch) {
    db.ping({
      requestTimeout: 30000
    }).then(async (response) => {
      try {
        await fullSync(db, config, storyblokClient, index)
        log('Stories synced!')
      } catch (error) {
        log('Stories not synced!')
      }
    }).catch(() => {
      log('Stories not synced!')
    })
  } else {
    log('ElasticSearch layer disabled')
  }

  api.get('/story/', (req, res) => {
    getStory(res, 'home')
  })

  api.get('/story/:story*', cache('14 days'), (req, res) => {
    let path = req.params.story + req.params[0]
    if (config.storeViews[path]) {
      path += '/home'
    }
    if (config.storyblok.skipElasticsearch) {
      return fetchStory(res, storyblokClient, path)
    }
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
