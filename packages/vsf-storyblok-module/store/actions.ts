import RootState from '@vue-storefront/core/types/RootState'
import config from 'config'
import fetch from 'isomorphic-fetch'
import qs from 'qs'
import { storyblokClient } from '../storyblok-client'
import { ActionTree, ActionContext } from 'vuex'
import { StoryblokState } from '../types/State'

export const actions: ActionTree<StoryblokState, RootState> = {
  async getPreviewToken ({ commit, state }, query) {
    if (state.previewToken) {
      return state.previewToken
    }

    const url = `${config.api.url}${config.storyblok.endpoint}/validate-editor/?${qs.stringify(query)}`

    const response = await fetch(url)

    const { result: { previewToken } } = await response.json()

    commit('setPreviewToken', { previewToken })

    return previewToken
  },
  async loadDraftStory ({ commit }: ActionContext<StoryblokState, RootState>, { id, previewToken }: { id: string, previewToken: string }) {
    commit('loadingStory', { key: id })

    const { data: { story } } = await storyblokClient.get(`cdn/stories/${id}`, {
      token: previewToken,
      version: 'draft'
    })

    commit('setStory', { key: id, story })
    return story
  },
  async loadStory ({ commit, state }, { fullSlug: key }: { fullSlug: string }) {
    const cachedStoryData = state.stories[key]
    if (cachedStoryData && cachedStoryData.loading) {
      // Already fetching this story
      return
    }
    
    if (cachedStoryData && cachedStoryData.story) {
      // Story already fetched
      // XXX: Should we refetch anyways?
      return cachedStoryData.story
    }

    const url = `${config.api.url}${config.storyblok.endpoint}/story/${key}`

    commit('loadingStory', { key })

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    })

    const { result: { story } } = await response.json()

    commit('setStory', { key, story })
    return story
  }
}
