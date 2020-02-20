import { storyblokClient } from './storyblok'

function mapStoryToBulkAction ({ story: { id } }) {
  return {
    index: {
      _id: id,
      _index: 'storyblok_stories',
      _type: 'story'
    }
  }
}

function indexStories ({ db, stories = [] }) {
  const bulkOps = stories.reduce((accumulator, story) => {
    accumulator.push(mapStoryToBulkAction({ story }))
    accumulator.push({
      ...story,
      content: JSON.stringify(story.content)
    })
    return accumulator
  }, [])

  return db.bulk({
    body: bulkOps
  })
}

async function syncStories ({ db, page = 1, perPage = 100 }) {
  const { data: { stories }, total } = await storyblokClient.get('cdn/stories', {
    page,
    per_page: perPage,
    resolve_links: 'url'
  })

  const newStories = stories.map(story => ({
    ...story,
    full_slug: story.full_slug.replace(/^\/|\/$/g, '')
  }))

  const promise = indexStories({ db, stories: newStories })

  const lastPage = Math.ceil((total / perPage))

  if (page < lastPage) {
    page += 1
    return syncStories({ db, page, perPage })
  }

  return promise
}

export { syncStories }
