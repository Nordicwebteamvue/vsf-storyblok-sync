import { actions } from '@vue-storefront/core/modules/url/store/actions'
import { ActionTree } from 'vuex';
import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'
import { removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'
import { KEY } from '.'
import { forStoryblok } from './mappingFallback'

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
    if (category !== null) {
      return {
        name: 'category',
        params: {
          slug: category.slug
        }
      }
    }
  } catch {
    return undefined
  }
}

const extendUrlVuex = {
  actions: {
    async mappingFallback ({ dispatch }, payload: { url: string, params: any}) {
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
  }
}

export const urlExtend = {
  key: 'url',
  store: { modules: [{ key: 'url', module: extendUrlVuex }] },
}
