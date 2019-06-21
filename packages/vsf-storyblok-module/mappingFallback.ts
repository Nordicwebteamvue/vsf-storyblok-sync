import config from 'config'
import { removeStoreCodeFromRoute, storeCodeFromRoute } from '@vue-storefront/core/lib/multistore'

export const forStoryblok = async ({ dispatch }, { url }) => {
  url = url.replace(/\/$/, "") // remove trailing slash
  const storeCode = storeCodeFromRoute(url)
  if (config.storeViews.multistore && storeCode && url === removeStoreCodeFromRoute(url)) {
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
