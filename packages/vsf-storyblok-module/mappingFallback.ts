import config from 'config'
import { removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'
import storeCodeFromRoute from '@vue-storefront/core/lib/storeCodeFromRoute'

const route = {
  name: 'storyblok',
  params: {
    // TODO: Why does this need to be here?
    slug: 'storyblok'
  }
}

export const forStoryblok = async ({ dispatch }, { url, params }) => {
  if (params && params._storyblok_c && params._storyblok_c === 'page') {
    return route
  }
  url = url.replace(/\/$/, "") // remove trailing slash
  const storeCode = storeCodeFromRoute(url)
  if (config.storeViews.multistore && storeCode && url === removeStoreCodeFromRoute(url)) {
    url = `${url}/home`
  }
  const story = await dispatch(`storyblok/loadStory`, { fullSlug: url }, { root: true })
  if (story) {
    return route
  }
}
