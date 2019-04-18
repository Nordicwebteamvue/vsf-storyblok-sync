import request from 'request'

const baseUrl = 'https://api.storyblok.com/v1/cdn/stories'
const objectToParams = object =>
  Object.entries(object).map(([key, value]) => `${key}=${value}`).join('&')

export const transformStory = (index) => ({ id, ...story } = {}) => ({
  index: index,
  type: 'story', // XXX: Change to _doc once VSF supports Elasticsearch 6
  id: id,
  body: story
})

export const getStories = (options, page = 1, language = null) => new Promise((resolve) => {
  const defaultOptions = {
    timestamp: Date.now(),
    per_page: 100,
    page
  }
  if (language) {
    options.starts_with = `${language}/*`
  }
  const optString = objectToParams(Object.assign({}, defaultOptions, options))
  request({
    url: `${baseUrl}?${optString}`,
    json: true
  }, (error, response, body) => {
    if (error) {
      throw new Error(error)
    }
    resolve(body.stories)
  })
})
