import StoryblokClient from 'storyblok-js-client'
import StoryblokVue from 'storyblok-vue'
import { router } from '@vue-storefront/core/app'
import { RouterManager } from '@vue-storefront/core/lib/router-manager'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'
import Render from '../components/global/Render.vue'
import Img from '../components/global/Img.vue'
import RouterLink from '../components/global/RouterLink.vue'
import RichText from '../components/global/RichText.vue'
import { once } from '@vue-storefront/core/helpers'
import VueLazyload from 'vue-lazyload'
import { StoryblokRoutes } from '../pages/routes'
import { getSettings } from '../helpers'

function beforeRegistration ({ Vue, config, store }) {
  once('__VUE_EXTEND_LAZY__', () => {
    console.log('init webp (before)')
    Vue.use(VueLazyload, {
      attempt: 2,
      preLoad: 1.5,
      filter: {
        webp (listener, options) {
          console.log('webp (before)', options.supportWebp)
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
  const settings = getSettings(config.storyblok.settings)
  if (settings.addRoutes) {
    RouterManager.addRoutes(StoryblokRoutes, router)
    setupMultistoreRoutes(config, router, StoryblokRoutes)
  }
  const storyblokClientConfig = {
    cache: {
      type: 'memory'
    },
    ...config.storyblok
  }

  const storyblokClient = new StoryblokClient(storyblokClientConfig)
  Vue.prototype.$storyblokClient = storyblokClient
  store.$storyblokClient = storyblokClient

  once('__VUE_USE_STORYBLOK__', () => {
    Vue.use(StoryblokVue)
  })
  Vue.component('sb-render', Render)
  Vue.component('sb-img', Img)
  Vue.component('sb-router-link', RouterLink)
  Vue.component('sb-rich-text', RichText)
}

export { beforeRegistration }
