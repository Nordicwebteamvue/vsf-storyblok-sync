import { storyblokClient } from './storyblok'
import { log, createIndex, createBulkOperations } from './helpers'

function indexStories ({ db, stories = [] }) {
  const bulkOps = createBulkOperations(stories)
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

const fullSync = async (db, config) => {
  log('Syncing published stories!')
  await db.indices.delete({ ignore_unavailable: true, index: 'storyblok_stories' })
  await db.indices.create(createIndex(config))
  await syncStories({ db, perPage: config.storyblok.perPage })
}

export { syncStories, fullSync }
