import { json, Router } from 'express'
import request from 'request'
import { promisify } from 'util'
import { apiStatus } from '../../../lib/util'
import { fullSync } from './fullSync'
import { log } from './helpers'
import protectRoute from './middleware/protectRoute'
import { storyblokClient } from './storyblok'

const rp = promisify(request)
const cacheInvalidate = async (config) => {
  if (config.invalidate) {
    log(`Invalidating cache... (${config.invalidate})`)
    await rp({
      uri: config.invalidate
    })
    log('Invalidated cache ✅')
  }
}

const transformStory = ({ id, ...story } = {}) => {
  story.content = JSON.stringify(story.content)
  story.full_slug = story.full_slug.replace(/^\/|\/$/g, '')
  return {
    index: 'storyblok_stories',
    type: 'story', // XXX: Change to _doc once VSF supports Elasticsearch 6
    id: id,
    body: story
  }
}

function hook ({ config, db }) {
  if (!config.storyblok || !config.storyblok.hookSecret) {
    throw new Error('🧱 : config.storyblok.hookSecret not found')
  }

  async function syncStory (req, res) {
    const cv = Date.now() // bust cache
    const { story_id: id, action } = req.body

    try {
      switch (action) {
        case 'published':
          const { data: { story } } = await storyblokClient.get(`cdn/stories/${id}`, {
            cv,
            resolve_links: 'url'
          })
          const publishedStory = transformStory(story)

          await db.index(publishedStory)
          log(`Published ${story.full_slug}`)
          break

        case 'unpublished':
          const unpublishedStory = transformStory({ id })
          await db.delete(unpublishedStory)
          log(`Unpublished ${id}`)
          break

        case 'branch_deployed':
          await fullSync(db, config)
          break
        default:
          break
      }
      await cacheInvalidate(config.storyblok)
      return apiStatus(res)
    } catch (error) {
      return apiStatus(res, {
        error: 'Webhook failed'
      })
    }
  }

  async function fullSyncRoute (req, res) {
    await fullSync(db, config)
    await cacheInvalidate(config.storyblok)
    return apiStatus(res)
  }

  const api = new Router()

  api.use(json())

  api.get('/hook', (req, res) => {
    res.send('You should POST to this endpoint')
  })
  api.post('/hook', syncStory)
  api.post('/hook', protectRoute(config), syncStory)
  api.get('/full', protectRoute(config), fullSyncRoute)

  return api
}

export { hook }
