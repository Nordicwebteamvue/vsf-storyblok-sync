import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'
import { state } from './state'
import { StoryblokSyncState } from '../types/State'

export const module: Module<StoryblokSyncState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
