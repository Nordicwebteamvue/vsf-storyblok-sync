import { json, Router } from 'express'
import request from 'request'
import { promisify } from 'util'
import { apiStatus } from '../../../lib/util'
import { fullSync } from './fullSync'

const rp = promisify(request)

const log = (string) => {
  console.log('📖 : ' + string) // eslint-disable-line no-console
}

const cacheInvalidate = async (config) => {
  if (config.invalidate) {
    log(`Invalidating cache... (${config.invalidate})`)
    await rp({
      uri: config.invalidate
    })
    log('Invalidated cache ✅')
  }
}

const transformStory = (index) => ({ id, ...story } = {}) => {
  story.content = JSON.stringify(story.content)
  story.full_slug = story.full_slug.replace(/^\/|\/$/g, '')
  return {
    index: index,
    type: 'story', // XXX: Change to _doc once VSF supports Elasticsearch 6
    id: id,
    body: story
  }
}

const protectRoute = (config) => (req, res, next) => {
  if (process.env.VS_ENV === 'dev') {
    if (!req.query.secret) {
      return apiStatus(res, {
        error: 'Missing query param: secret'
      }, 403)
    }
    if (req.query.secret !== config.storyblok.hookSecret) {
      return apiStatus(res, {
        error: 'Invalid secret'
      }, 403)
    }
  }
  next()
}

function hook ({ config, db, index, storyblokClient }) {
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
          const publishedStory = transformStory(index)(story)

          await db.index(publishedStory)
          log(`Published ${story.full_slug}`)
          break

        case 'unpublished':
          const unpublishedStory = transformStory(index)({ id })
          await db.delete(unpublishedStory)
          log(`Unpublished ${id}`)
          break

        case 'release_merged':
        case 'branch_deployed':
          await fullSync(db, config, storyblokClient, index)
          break
        default:
          break
      }
      await cacheInvalidate(config.storyblok)
      return apiStatus(res)
    } catch (error) {
      console.log('Failed fetching story', error)
      return apiStatus(res, {
        error: 'Fetching story failed'
      })
    }
  }

  async function fullSyncRoute (req, res) {
    await fullSync(db, config, storyblokClient, index)
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
