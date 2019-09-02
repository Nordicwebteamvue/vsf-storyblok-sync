import { extendStore } from '@vue-storefront/core/helpers'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'
import { RouterManager } from '@vue-storefront/core/lib/router-manager'
import StoryblokVue from 'storyblok-vue'
import Vue from 'vue'
import { getSettings } from './helpers';
import { storyblokRoutes } from './pages/routes'
import { module as storyblokStoreModule } from './store'
import { storyblokClient } from './storyblok-client'
import { module as storyblokUrlStoreModule } from './urlStoreModule'
import Render from './components/Render.vue'

const KEY = 'storyblok'

const StoryblokModule: StorefrontModule = function (app, store, router, moduleConfig = {}, appConfig) {
  const { addRoutes } = getSettings(appConfig.storyblok.settings)

  if (addRoutes) {
    RouterManager.addRoutes(storyblokRoutes)
    setupMultistoreRoutes(appConfig, router, storyblokRoutes)
  }

  store.registerModule('storyblok', storyblokStoreModule)
  extendStore('url', storyblokUrlStoreModule)

  Vue.prototype.$storyblokClient = storyblokClient

  Vue.use(StoryblokVue)

  const { components = {} } = moduleConfig
  Vue.component('sb-render', { ...Render, data() { return { components } } })
}

export { KEY, StoryblokModule }
