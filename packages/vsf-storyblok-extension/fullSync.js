import { syncStories } from './sync-stories'
import { log, createIndex } from './helpers'

export const fullSync = async (db, config) => {
  log('Syncing published stories!')
  await db.indices.delete({ ignore_unavailable: true, index: 'storyblok_stories' })
  await db.indices.create(createIndex(config))
  await syncStories({ db, perPage: config.storyblok.perPage })
}
