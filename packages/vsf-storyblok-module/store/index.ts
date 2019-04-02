import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { cacheStorage } from '../'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'
import { state } from './state'


export const module: Module<any, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
