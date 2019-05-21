import { MutationTree } from 'vuex'
import { StoryblokState } from '../types/State'

export const mutations: MutationTree<StoryblokState> = {
  loadingStory (state: StoryblokState, { key }) {
    state.stories[key] = {
      ...state.stories[key],
      loading: true
    }
  },
  setStory (state: StoryblokState, { key, story }) {
    state.stories[key] = {
      ...state.stories[key],
      loading: false,
      story
    }
  },
  setPreviewToken (state: StoryblokState, { previewToken }) {
    state.previewToken = previewToken
  },
  updateStory (state: StoryblokState, { key, story }) {
    state.stories[key] = {
      ...state.stories[key],
      story
    }
  }
}
