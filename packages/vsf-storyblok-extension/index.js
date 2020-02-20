import { Router } from 'express'
import crypto from 'crypto'
import { apiStatus } from '../../../lib/util'
import { getClient } from '../../../lib/elastic'
import { fullSync, handleHook } from './sync'
import { getHits, getHitsAsStory, queryByPath, log, cacheInvalidate } from './helpers'
import { initStoryblokClient } from './storyblok'
import protectRoute from './middleware/protectRoute'

module.exports = ({ config }) => {
  if (!config.storyblok || !config.storyblok.previewToken) {
    throw new Error('🧱 : config.storyblok.previewToken not found')
  }
  initStoryblokClient(config)
  const db = getClient(config)
  const api = Router()

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

  // Seed the database on boot
  (async () => {
    try {
      await db.ping()
      await fullSync(db, config)
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

  api.post('/hook', protectRoute(config), async (req, res) => {
    try {
      await handleHook(db, config, req.body)
      return apiStatus(res)
    } catch (error) {
      return apiStatus(res, {
        error: 'Webhook failed'
      })
    }
  })
  api.get('/full', protectRoute(config), async (req, res) => {
    await fullSync(db, config)
    await cacheInvalidate(config.storyblok)
    log('Stories synced!')
    return apiStatus(res)
  })

  return api
}
