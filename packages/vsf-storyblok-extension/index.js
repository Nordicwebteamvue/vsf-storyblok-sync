import { Router } from 'express'
import { getStories, transformStory } from './helpers'
import crypto from 'crypto'
import StoryblokClient from 'storyblok-js-client'
import { apiStatus } from '../../../lib/util'
import { hook } from './hook'

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

  const { indexPrefix = '' } = config.storyblok
  const index = indexPrefix + 'stories'

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
      apiStatus(res, {
        story: hits.hits[0]._source
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

  const syncStories = async () => {
    console.log('📖 : Syncing published stories!') // eslint-disable-line no-console
    const languages = [null].concat(config.storyblok.extraLanguages || [])
    const promises = languages.map(lang => getStories({
      token: config.storyblok.previewToken
    }, 1, lang))
    const result = await Promise.all(promises)
    const stories = [].concat.apply([], result).map(transformStory(index))

    return Promise.all(stories.map(story => db.index(story)))
  }

  db.ping().then(async (response) => {
    try {
      await syncStories()
      console.log('📖 : Stories synced!') // eslint-disable-line no-console
    } catch (error) {
      console.log('📖 : Stories not synced!') // eslint-disable-line no-console
    }
  }).catch(() => {
    console.log('📖 : Stories not synced!') // eslint-disable-line no-console
  })

  api.get('/story/', (req, res) => {
    getStory(res, 'home')
  })

  api.get('/story/:story*', (req, res) => {
    const path = req.params.story + req.params[0]
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
