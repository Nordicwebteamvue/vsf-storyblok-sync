import { StoryblokState } from '../types/State'
import { ActionTree, ActionContext, Store } from 'vuex'
import config from 'config'
import RootState from '@vue-storefront/core/types/RootState'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import qs from 'qs'

export const actions: ActionTree<StoryblokState, RootState> = {
  async setStoreCode ({ commit, state }, storeCode) {
    commit('setStoreCode', storeCode)
  },
  async getPreviewToken ({ commit, state }, query) {
    if (state.previewToken) {
      return state.previewToken
    }

    const url = `${config.storyblok.endpoint}/validate-editor/?${qs.stringify(query)}`
    const { result: { previewToken } }: any = await TaskQueue.execute({
      url,
      silent: true
    })

    commit('setPreviewToken', { previewToken })
    return previewToken
  },
  async loadDraftStory (this: Store<any> & { $storyblokClient: any }, { commit }: ActionContext<StoryblokState, RootState>, { id, previewToken }) {
    commit('loadingStory', { key: id })

    const { data: { story } } = await this.$storyblokClient.get(`cdn/stories/${id}`, {
      token: previewToken,
      version: 'draft'
    })

    commit('setStory', { key: id, story })
    return story
  },
  async loadStory ({ commit, state }, { fullSlug: key }) {
    if (state.stories[key] && state.stories[key].loading) {
      // Already fetching this story
      return
    }
    commit('loadingStory', { key })

    const cachedStory = state.stories[key].story
    if (cachedStory) {
      return cachedStory
    }

    const url = `${config.storyblok.endpoint}/story/${key}`
    const { result: { story }}: any = await TaskQueue.execute({
      url,
      payload: {
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      },
      silent: true
    })

    commit('setStory', { key, story })
    return story
  }
}
