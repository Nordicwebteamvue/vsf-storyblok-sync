import StoryblokClient from 'storyblok-js-client'
import StoryblokVue from 'storyblok-vue'
import { extendModule } from '@vue-storefront/core/lib/module'
import { router } from '@vue-storefront/core/app'
import { RouterManager } from '@vue-storefront/core/lib/router-manager'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'
import Render from '../components/global/Render.vue'
import Img from '../components/global/Img.vue'
import RouterLink from '../components/global/RouterLink.vue'
import RichTextResolver from '../components/global/RichTextResolver.vue'
import { once } from '@vue-storefront/core/helpers'
import { StoryblokRoutes } from '../pages/routes'
import { getSettings } from '../helpers'

function beforeRegistration ({ Vue, config, store }) {
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
  Vue.component('sb-rich-text-resolver', RichTextResolver)
}

export { beforeRegistration }
