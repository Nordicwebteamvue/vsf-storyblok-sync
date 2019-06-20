import config from 'config'
import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'
import { removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'

export const forCategory = async ({ dispatch }, { url }) => {
  url = (removeStoreCodeFromRoute(url) as string)
  try {
    const category = await dispatch('category/single', { key: 'url_path', value: url }, { root: true })
    if (category !== null) {
      return {
        name: 'category',
        params: {
          slug: category.slug
        }
      }
    }
  } catch {
    return
  }
}

export const forProduct = async ({ dispatch }, { url, params }) => {
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

export const forStoryblok = async ({ dispatch }, { url }) => {
  if (config.storeViews.multistore && config.defaultStoreCode) {
    if (url === config.defaultStoreCode || url.startsWith(`${config.defaultStoreCode}/`)) {
      return
    } else if (url === removeStoreCodeFromRoute(url)) {
      url = `${config.defaultStoreCode}/${url}`
    }
  }

  const story = await dispatch(`storyblok/loadStory`, { fullSlug: url }, { root: true })
  if (story) {
    return {
      name: `storyblok`,
      params: {
        slug: "storyblok"
      },
      props: {
        storyblokFullSlug: story.full_slug
      }
    }
  }
}
