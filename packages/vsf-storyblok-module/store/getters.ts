import { StoryblokState } from '../types/State'
import { GetterTree } from 'vuex'

export const getters: GetterTree<StoryblokState, any> = {
  loading: (state) => Object.values(state.stories).find(story => story.loading) || false
}
