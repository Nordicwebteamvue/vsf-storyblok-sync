import { StoryblokState } from '../types/State'
import { GetterTree } from 'vuex'

export const getters: GetterTree<StoryblokState, any> = {
  isLoading: (state) => Object.values(state.stories).find(story => story.loading) || false
}
