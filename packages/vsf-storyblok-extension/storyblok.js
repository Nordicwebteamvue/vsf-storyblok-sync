import StoryblokClient from 'storyblok-js-client'

export let storyblokClient

export function initStoryblokClient (config) {
  const storyblokClientConfig = {
    accessToken: config.storyblok.previewToken,
    cache: {
      type: 'none'
    }
  }

  storyblokClient = new StoryblokClient(storyblokClientConfig)
}
