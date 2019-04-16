import { StoryblokSyncState } from '../types/State'
import { GetterTree } from 'vuex'

export const getters: GetterTree<StoryblokSyncState, any> = {
  getPreviewToken: (state) => state.previewToken,
  getStory: (state) => state.story,
  isLoading: (state) => state.loading
}
