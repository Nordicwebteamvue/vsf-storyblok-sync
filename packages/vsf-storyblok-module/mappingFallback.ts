import config from 'config'
import { currentStoreView, removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'
import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'

const route = {
  name: 'storyblok',
  params: {
    // TODO: Why does this need to be here?
    slug: 'storyblok'
  }
}

const forProduct = async ({ dispatch }, { url, params }) => {
  url = (removeStoreCodeFromRoute(url) as string)
  const productQuery = new SearchQuery()
  const productSlug = url.split('/').reverse()[0]
  productQuery.applyFilter({key: 'url_path', value: {'eq': productSlug}})
  const products = await dispatch('product/list', { query: productQuery }, { root: true })
  if (products && products.items && products.items.length) {
    const product = products.items[0]
    return {
      name: product.type_id + '-product',
      params: {
        slug: product.slug,
        parentSku: product.sku,
        childSku: params['childSku'] ? params['childSku'] : product.sku
      }
    }
  }
}

const forCategory = async ({ dispatch }, { url }) => {
  url = (removeStoreCodeFromRoute(url) as string)
  try {
    const category = await dispatch('category/single', { key: 'url_path', value: url }, { root: true })
    console.log({ category })
    if (category !== null) {
      return {
        name: 'category',
        params: {
          slug: category.slug
        }
      }
    }
  } catch (error) {
    console.log({ error })
    return undefined
  }
}

const forStoryblok = async ({ dispatch }, { url, params }) => {
  console.log({ url, params })
  if (params && params._storyblok) {
    return route
  }

  console.log({ currentStoreCode: currentStoreView().storeCode, defaultStoreCode: config.defaultStoreCode })

  if (!url && currentStoreView().storeCode === config.defaultStoreCode) {
    url = config.defaultStoreCode
  }

  console.log({ url })

  const story = await dispatch(`storyblok/loadStory`, { fullSlug: url }, { root: true })
  if (story) {
    return route
  }
}

async function mappingFallback ({ dispatch }, payload: { url: string, params: any}) {
  const product = await forProduct({ dispatch }, payload)
  if (product) {
    return product
  }
  const category = await forCategory({ dispatch }, payload)
  if (category) {
    return category
  }
  const story = await forStoryblok({ dispatch }, payload)
  if (story) {
    return story
  }
  throw new Error('No route found')
}

export { forStoryblok, mappingFallback }
