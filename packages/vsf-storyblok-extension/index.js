const { Router } = require('express')
const {getStories, transformStory, apiStatus} = require('./helpers')

module.exports = ({ config, db }) => {
  if (!config.storyblok || !config.storyblok.accessToken) {
    throw new Error('🧱 : config.storyblok.accessToken not found')
  }
  const indexPrefix = config.storyblok.indexPrefix || ''
  const index = indexPrefix + 'stories'

  let api = Router()

  const getStory = (res, id) => db.get({
    index,
    type: 'object',
    id
  }).then(response => {
    apiStatus(res, {
      story: response._source
    })
  }).catch(() => {
    apiStatus(res, {
      story: false
    }, 404)
  })

  const fetchStories = async () => {
    console.log('🧱 : Fetching stories!') // eslint-disable-line no-console
    const languages = [null].concat(config.storyblok.extraLanguages || [])
    const promises = languages.map(lang => getStories({
      token: config.storyblok.accessToken
    }, 1, lang))
    const result = await Promise.all(promises)
    const stories = [].concat.apply([], result).map(transformStory(index))
    return Promise.all(stories.map(story => db.update(story)))
  }

  // Run once on startup
  setTimeout(() => {
    fetchStories()
  }, 10000) // Let elasticsearch start

  api.get('/story/', (req, res) => {
    getStory(res, 'home')
  })

  api.get('/story/:story*', (req, res) => {
    const id = req.params.story + req.params[0]
    getStory(res, id)
  })

  api.get('/hook', async (req, res) => {
    if (config.storyblok.hookSecret && process.env.VS_ENV !== 'dev') {
      if (!req.query.secret) {
        return apiStatus(res, {
          error: 'Missing secret query param'
        }, 403)
      }
      if (req.query.secret !== config.storyblok.hookSecret) {
        return apiStatus(res, {
          error: 'Invalid secret'
        }, 403)
      }
    }
    const stories = await fetchStories()
    apiStatus(res, {
      stories_found: stories.length,
      error: false
    })
  })
  return api
}
