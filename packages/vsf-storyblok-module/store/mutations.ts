import { MutationTree } from 'vuex'
import { StoryblokSyncState } from '../types/State'

export const mutations: MutationTree<StoryblokSyncState> = {
  loadingStory (state: StoryblokSyncState) {
    state.id = undefined
    state.loading = true
    state.story = undefined
  },
  setStory (state: StoryblokSyncState, {id, slug, story}) {
    state.id = id
    state.loading = false
    state.slug = slug
    state.story = story
  },
  setPreviewToken (state: StoryblokSyncState, {previewToken}) {
    state.previewToken = previewToken
  },
  updateStory (state: StoryblokSyncState, {story}) {
    state.story = story
  }
}
