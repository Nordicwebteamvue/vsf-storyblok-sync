import config from 'config'
import StoryblokClient from 'storyblok-js-client'

const storyblokClientConfig = {
  cache: {
    type: 'memory'
  },
  ...config.storyblok
}

const storyblokClient = new StoryblokClient(storyblokClientConfig)

export { storyblokClient }
