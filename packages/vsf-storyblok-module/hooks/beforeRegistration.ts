import StoryblokClient from 'storyblok-js-client'
import StoryblokVue from 'storyblok-vue'
import { extendModule } from '@vue-storefront/core/lib/module'
import { router } from '@vue-storefront/core/app'
import { RouterManager } from '@vue-storefront/core/lib/router-manager'
import Render from '../components/Render.vue'
import { StoryblokRoutes } from '../pages/routes'

const defaultSettings = {
  addRoutes: true
}

const getSettings = (settings = {}) => ({
  ...defaultSettings,
  ...settings
})

function beforeRegistration ({ Vue, config, store }) {
  const settings = getSettings(config.storyblok.settings)
  if (settings.addRoutes) {
    RouterManager.addRoutes(StoryblokRoutes, router)
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

  Vue.use(StoryblokVue)
  Vue.component('sb-render', Render)
}

export { beforeRegistration }
