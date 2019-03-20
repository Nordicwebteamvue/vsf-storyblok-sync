import request from 'request';

const baseUrl = 'https://api.storyblok.com/v1/cdn/stories';
const objectToParams = object =>
  Object.entries(object).map(([key, value]) => `${key}=${value}`).join('&');

export const transformStory = (index) => (story) => ({
  index: index,
  type: 'object',
  id: story.full_slug,
  body: {
    doc: {
      slug: story.slug,
      content: story.content,
      language: story.lang,
      name: story.name,
      id: story.id,
      parent_id: story.parent_id,
    }
  },
  "doc_as_upsert" : true
})

export const getStories = (options, page = 1, language = null) => new Promise((resolve) => {
  const defaultOptions = {
    timestamp: Date.now(),
    per_page: 100,
    page,
  }
  if (language) {
    options.starts_with = `${language}/*`
  }
  const optString = objectToParams(Object.assign({}, defaultOptions, options));
  request({
    url: `${baseUrl}?${optString}`,
    json: true,
  }, (error, response, body) => {
    if (error) {
      throw new Error(error);
    }
    resolve(body.stories);
  })
});
