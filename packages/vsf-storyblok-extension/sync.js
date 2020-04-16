import { storyblokClient } from './storyblok'
import { log, createIndex, createBulkOperations, transformStory, cacheInvalidate } from './helpers'

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

const handleHook = async (db, config, params) => {
  const cv = Date.now() // bust cache
  const { story_id: id, action } = params

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
}

const seedDatabase = async (db, config) => {
  try {
    await db.ping()
    await fullSync(db, config)
    log('Stories synced!')
  } catch (error) {
    log('Stories not synced!')
  }
}

export { syncStories, fullSync, handleHook, seedDatabase }
