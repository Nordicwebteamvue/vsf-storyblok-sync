import { json, Router } from 'express'
import { apiStatus } from '../../../lib/util'

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

function hook ({ config, db, index, storyblokClient }) {
  if (!config.storyblok || !config.storyblok.hookSecret) {
    throw new Error('🧱 : config.storyblok.hookSecret not found')
  }

  async function syncStory (req, res) {
    if (process.env.VS_ENV !== 'dev') {
      if (!req.query.secret) {
        return apiStatus(res, {
          error: 'Missing query param: "secret"'
        }, 403)
      }

      if (req.query.secret !== config.storyblok.hookSecret) {
        return apiStatus(res, {
          error: 'Invalid secret'
        }, 403)
      }
    }

    const cv = Date.now() // bust cache
    const { story_id: id, action } = req.body

    try {
      if (action === 'published') {
        const { data: { story } } = await storyblokClient.get(`cdn/stories/${id}`, {
          cv,
          resolve_links: 'url'
        })
        const transformedStory = transformStory(index)(story)

        await db.index(transformedStory)
      } else if (action === 'unpublished') {
        const transformedStory = transformStory(index)({ id })
        await db.delete(transformedStory)
      }

      return apiStatus(res)
    } catch (error) {
      return apiStatus(res, {
        error: 'Fetching story failed'
      })
    }
  }

  const api = new Router()

  api.use(json())

  api.post('/hook', syncStory)

  return api
}

export { hook }
