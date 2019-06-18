import config from 'config'
import { removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'

export const forStoryblok = async ({ dispatch }, { url }) => {
  url = url.replace(/\/$/, "")
  // TODO: use config.storeViews.defaultStoreCode
  // if (url === removeStoreCodeFromRoute(url) && config.storeViews.defaultStoreCode) {
  //   url = `${config.storeViews.defaultStoreCode}/url`
  // }
  if (config.storeViews.multistore && url === removeStoreCodeFromRoute(url)) {
    url = `${url}/home`
  }
  const story = await dispatch(`storyblok/loadStory`, { fullSlug: url }, { root: true })
  if (story) {
    return {
      name: 'storyblok',
      params: {
        // TODO: Why does this need to be here?
        slug: 'storyblok'
      }
    }
  }
}
