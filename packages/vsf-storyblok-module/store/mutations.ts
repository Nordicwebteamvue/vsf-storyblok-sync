import { MutationTree } from 'vuex'

export const mutations: MutationTree<any> = {
  loading (state) {
    state.loading = true
    state.story = null
  },
  set (state, {id, story}) {
    state.id = id
    state.story = story
    state.loading = false
  },
  update (state, {story}) {
    state.story = story
  }
}
