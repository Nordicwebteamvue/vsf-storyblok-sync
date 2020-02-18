import has from 'lodash-es/has'

function afterRegistration ({ isServer, Vue, store }) {
  if (isServer && has(Vue, 'prototype.$ssrRequestContext.server.request')) {
    const { request } = Vue.prototype.$ssrRequestContext.server
    if (request.headers['x-vs-store-code']) {
      store.dispatch('storyblok/setStoreCode', request.headers['x-vs-store-code'])
    }
    const supportsWebp = request.headers.accept.includes('image/webp')
    store.commit('storyblok/supportsWebp', supportsWebp)
  }
}
export { afterRegistration }
