import { Module } from 'vuex'
import config from 'config'
import RootState from '@vue-storefront/core/types/RootState'
import fetch from 'isomorphic-fetch'
import StoryblokSyncState from '../types/StoryblokSyncState'
import { cacheStorage } from '../'

export const module: Module<any, RootState> = {
  namespaced: true,
  state: {
    story: null,
    loading: false,
  },
  getters: {
    getStory: (state) => state.story,
    isLoading: (state) => state.loading,
  },
  mutations: {
    loading (state) {
      state.loading = true
      state.story = null
    },
    set (state, {id, story}) {
      state.story = story
      state.loading = false
    }
  },
  actions: {
    loading ({ commit }) {
      commit('loading')
    },
    async loadAsync ({ commit, state }, {id}): Promise<any> {
      const storyKey = 'story-' + id
      commit('loading')
      const cachedStory = await cacheStorage.getItem(storyKey)
      if (cachedStory) {
        console.log('cachedStory', cachedStory);
        commit('set', {id, story: cachedStory})
        return
      }
      const url = config.storyblok.endpoint.replace('{{id}}', id)
      const {result} = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      }).then(res => res.json())
      await cacheStorage.setItem(storyKey, result.story)
      commit('set', {id, story: result.story})
    },
  }
}
