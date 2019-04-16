import StoryblokClient from 'storyblok-js-client'
import StoryblokVue from 'storyblok-vue'

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
}

export { beforeRegistration }
