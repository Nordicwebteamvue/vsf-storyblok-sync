import { StoryblokSyncState } from '../types/State'
import { ActionTree } from 'vuex';
import config from 'config'
import fetch from 'isomorphic-fetch'
import { cacheStorage } from '../'

export const actions: ActionTree<StoryblokSyncState, any> = {
  loading ({ commit }) {
    commit('loading')
  },
  async loadPreviewAsync ({ commit, state }, { id, timestamp, spaceId }): Promise<any> {
    const url = `https://api.storyblok.com/v1/cdn/stories/${id}?token=${config.storyblok.accessToken}&timestamp=${timestamp}&version=draft`
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
    })
    const {story} = await response.json()
    commit('set', {id, story})
    return story;
  },
  async loadAsync ({ commit, state }, {id}): Promise<any> {
    commit('loading')
    const cachedStory = await cacheStorage.getItem(id)
    if (cachedStory) {
      commit('set', {id, story: cachedStory})
      return
    }
    const url = config.storyblok.endpoint.replace('{{id}}', id)
    const {result} = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
    }).then(res => res.json())
    commit('set', {id, story: result.story})
    await cacheStorage.setItem(id, result.story)
    return result.story
  },
}
