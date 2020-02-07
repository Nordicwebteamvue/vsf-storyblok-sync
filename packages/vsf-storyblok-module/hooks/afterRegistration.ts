function afterRegistration ({ isServer, Vue, store }) {
  if (isServer) {
    const { request: req } = Vue.prototype.$ssrRequestContext.server
    if (req.headers['x-vs-store-code']) {
      store.dispatch('storyblok/setStoreCode', req.headers['x-vs-store-code'])
    }
    const supportsWebp = req.headers.accept.includes('image/webp')
    store.commit('storyblok/supportsWebp', supportsWebp)
  }
}
export { afterRegistration }
