import { Router } from 'express'
import crypto from 'crypto'
import StoryblokClient from 'storyblok-js-client'
import { apiStatus } from '../../../lib/util'
import { getClient } from '../../../lib/elastic'
import { hook } from './hook'
import { fullSync } from './fullSync'
import { getHits, getHitsAsStory, queryByPath, log } from './helpers'

module.exports = ({ config }) => {
  if (!config.storyblok || !config.storyblok.previewToken) {
    throw new Error('🧱 : config.storyblok.previewToken not found')
  }
  const db = getClient(config)
  const storyblokClientConfig = {
    accessToken: config.storyblok.previewToken,
    cache: {
      type: 'none'
    }
  }

  const storyblokClient = new StoryblokClient(storyblokClientConfig)
  const api = Router()

  api.use(hook({ config, db, storyblokClient }))

  const getStory = async (res, path) => {
    try {
      const response = await db.search(queryByPath(path))
      const hits = getHits(response)
      const story = getHitsAsStory(hits)
      apiStatus(res, { story })
    } catch (error) {
      apiStatus(res, { story: false }, 404)
    }
  }

  (async () => {
    try {
      await db.ping()
      await fullSync(db, config, storyblokClient)
      log('Stories synced!')
    } catch (error) {
      log('Stories not synced!')
    }
  })()

  api.get('/story/', (req, res) => {
    getStory(res, 'home')
  })

  api.get('/story/:story*', (req, res) => {
    let path = req.params.story + req.params[0]
    if (config.storeViews[path]) {
      path += '/home'
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
