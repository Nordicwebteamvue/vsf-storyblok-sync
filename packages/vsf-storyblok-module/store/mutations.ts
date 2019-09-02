import { MutationTree } from 'vuex'
import { StoryblokState } from '../types/State'

export const mutations: MutationTree<StoryblokState> = {
  loadingStory (state: StoryblokState, { key }: { key: string }) {
    state.stories = {
      ...state.stories,
      [key]: {
        ...state.stories[key],
        loading: true
      }
    }
  },
  setStory (state: StoryblokState, { key, story }: { key: string, story: object }) {
    state.stories = {
      ...state.stories,
      [key]: {
        ...state.stories[key],
        loading: false,
        story
      }
    }
  },
  setPreviewToken (state: StoryblokState, { previewToken }: { previewToken: string }) {
    state.previewToken = previewToken
  },
  updateStory (state: StoryblokState, { key, story }) {
    state.stories = {
      ...state.stories,
      [key]: {
        ...state.stories[key],
        story
      }
    }
  }
}
