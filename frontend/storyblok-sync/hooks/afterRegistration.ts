import qs from 'qs'
import SbRender from '../components/SbRender.vue'

export function beforeRegistration(Vue, config, store, isServer) {
  store.dispatch('storyblok/loadComponent', {
    component: SbRender,
    key: 'page'
  })
}
