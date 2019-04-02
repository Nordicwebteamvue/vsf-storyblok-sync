import { StoryblokSyncState } from '../types/State'
import { GetterTree } from 'vuex';
import SbDebug from '../components/SbDebug.vue'

export const getters: GetterTree<StoryblokSyncState, any> = {
  getStory: (state) => state.story,
  isLoading: (state) => state.loading
}
