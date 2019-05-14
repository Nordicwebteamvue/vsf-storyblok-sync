import StoryblokClient from 'storyblok-js-client'
import StoryblokVue from 'storyblok-vue'
import Render from '../components/Render.vue'

function beforeRegistration ({ Vue, config, store }) {
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
