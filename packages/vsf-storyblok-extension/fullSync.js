import { syncStories } from './sync-stories'
import { log } from './helpers'

export const fullSync = async (db, config, storyblokClient) => {
  log('Syncing published stories!')
  await db.indices.delete({ ignore_unavailable: true, index: 'storyblok_stories' })
  await db.indices.create({
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
  })
  await syncStories({ db, perPage: config.storyblok.perPage, storyblokClient })
}
