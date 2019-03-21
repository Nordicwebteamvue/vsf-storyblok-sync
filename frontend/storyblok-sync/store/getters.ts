import { StoryblokSyncState } from '../types/StoryblokSyncState'
import { GetterTree } from 'vuex';
import SbDebug from '../components/SbDebug.vue'

export const getters: GetterTree<StoryblokSyncState, any> = {
  getStory: (state) => state.story,
  isLoading: (state) => state.loading,
  components: (state) => state.components,
  component: (state) => (id) => {
    if (state.components[id]) {
      return state.components[id]
    }
    return SbDebug
  },
}
