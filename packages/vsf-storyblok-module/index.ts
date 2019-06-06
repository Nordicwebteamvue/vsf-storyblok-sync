import { module } from './store'
import { beforeRegistration } from './hooks/beforeRegistration'
import { VueStorefrontModule, VueStorefrontModuleConfig } from '@vue-storefront/core/lib/module'

export const KEY = 'storyblok'

const moduleConfig: VueStorefrontModuleConfig = {
  key: KEY,
  store: { modules: [{ key: KEY, module }] },
  beforeRegistration
}

export { urlExtend } from './urlExtend'
export { StoryblokRoutes } from './pages/routes'

export const Storyblok = new VueStorefrontModule(moduleConfig)
