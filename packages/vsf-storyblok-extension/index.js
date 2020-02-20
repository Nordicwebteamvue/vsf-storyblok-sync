import { Router } from 'express'
import crypto from 'crypto'
import StoryblokClient from 'storyblok-js-client'
import { apiStatus } from '../../../lib/util'
import { hook } from './hook'
import { fullSync, log } from './fullSync'

function getHits (result) {
  if (result.body) { // differences between ES5 andd ES7
    return result.body.hits
  } else {
    return result.hits
  }
}

module.exports = ({ config, db }) => {
  if (!config.storyblok || !config.storyblok.previewToken) {
    throw new Error('🧱 : config.storyblok.previewToken not found')
  }

  const storyblokClientConfig = {
    accessToken: config.storyblok.previewToken,
    cache: {
      type: 'none'
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
            term: {
              'full_slug.keyword': path
            }
          }
        }
      }
    }
  }).then((response) => {
    const hits = getHits(response)
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

  db.ping().then(async () => {
    await fullSync(db, config, storyblokClient, index)
    log('Stories synced!')
  }).catch((error) => {
    console.log('error', error)
    log('Stories not synced!')
  })

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
