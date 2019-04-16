import { StoryblokSyncState } from '../types/State'
import { ActionTree, ActionContext, Store } from 'vuex'
import config from 'config'
import fetch from 'isomorphic-fetch'
import { cacheStorage } from '../'
import RootState from '@vue-storefront/core/types/RootState'
import qs from 'qs'

export const actions: ActionTree<StoryblokSyncState, RootState> = {
  loading ({ commit }) {
    commit('loadingStory')
  },
  async getPreviewToken ({ commit, state }, query) {
    if (state.previewToken) {
      return state.previewToken
    }

    const url = `${config.storyblok.endpoint}/validate-editor/?${qs.stringify(query)}`

    const response = await fetch(url)

    const { result: { previewToken } } = await response.json()

    commit('setPreviewToken', { previewToken })

    return previewToken
  },
  async loadDraftStory (this: Store<any> & { $storyblokClient: any }, { commit }: ActionContext<StoryblokSyncState, RootState>, { id, previewToken }) {
    commit('loadingStory')

    const { data: { story } } = await this.$storyblokClient.get(`cdn/stories/${id}`, {
      token: previewToken,
      version: 'draft'
    })

    commit('setStory', {id, story})
    return story
  },
  async loadStory ({ commit }, {slug}) {
    commit('loadingStory')

    const cachedStory = await cacheStorage.getItem(slug)

    if (cachedStory) {
      commit('setStory', {slug, story: cachedStory})
      return cachedStory
    }

    const url = `${config.storyblok.endpoint}/story${slug}`

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    })

    const { result: { story } } = await response.json()

    commit('setStory', {slug, story})
    await cacheStorage.setItem(slug, story)
    return story
  }
}
