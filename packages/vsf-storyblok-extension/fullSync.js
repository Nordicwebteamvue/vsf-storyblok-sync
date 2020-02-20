import { syncStories } from './sync-stories'
import { log } from './helpers'

export const fullSync = async (db, config, storyblokClient, index) => {
  log('Syncing published stories!')
  await db.indices.delete({ ignore_unavailable: true, index })
  await db.indices.create({
    index,
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
  await syncStories({ db, index, perPage: config.storyblok.perPage, storyblokClient })
}
