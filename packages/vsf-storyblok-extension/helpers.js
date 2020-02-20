export function getHits (result) {
  if (result.body) { // differences between ES5 andd ES7
    return result.body.hits
  } else {
    return result.hits
  }
}

export function getHitsAsStory (hits) {
  if (hits.total === 0) {
    throw new Error('Missing story')
  }
  const story = hits.hits[0]._source
  if (typeof story.content === 'string') {
    story.content = JSON.parse(story.content)
  }
  return story
}

function mapStoryToBulkAction ({ story: { id } }) {
  return {
    index: {
      _id: id,
      _index: 'storyblok_stories',
      _type: 'story'
    }
  }
}

export function createBulkOperations (stories = []) {
  return stories.reduce((accumulator, story) => {
    accumulator.push(mapStoryToBulkAction({ story }))
    accumulator.push({
      ...story,
      content: JSON.stringify(story.content)
    })
    return accumulator
  }, [])
}

export function createIndex (config) {
  return {
    index: 'storyblok_stories',
    body: {
      index: {
        mapping: {
          total_fields: {
            limit: config.storyblok.fieldLimit || 1000
          }
        }
      }
    }
  }
}

export function queryByPath (path) {
  return {
    index: 'storyblok_stories',
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
  }
}

export const log = (string) => {
  console.log('📖 : ' + string) // eslint-disable-line no-console
}
