import VueLazyload from 'vue-lazyload'
import { once } from '@vue-storefront/core/helpers'

export function afterRegistration({ Vue, store, isServer }) {
  once('__VUE_EXTEND_LAZY__', () => {
    console.log('init webp')
    Vue.use(VueLazyload, {
      attempt: 2,
      preLoad: 1.5,
      filter: {
        webp (listener, options) {
          console.log('webp', options.supportWebp)
          if (!options.supportWebp) {
            const isCDN = /img2.storyblok.com/
            if (isCDN.test(listener.src)) {
              // TODO: Make sure it works with other filters
              listener.src = listener.src.replace('filters:format(webp)/', '')
            }
          }
        }
      }
    })
  })
}
