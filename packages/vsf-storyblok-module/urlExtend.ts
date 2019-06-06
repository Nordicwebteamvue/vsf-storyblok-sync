import { actions } from '@vue-storefront/core/modules/url/store/actions'
import { ActionTree } from 'vuex';
import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'
import { removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'

const forProduct = async ({ dispatch }, url, params) => {
  const productQuery = new SearchQuery()
  url = (removeStoreCodeFromRoute(url) as string)
  productQuery.applyFilter({key: 'url_path', value: {'eq': url}}) // Tees category
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

const forCategory = async ({ dispatch }, url) => {
  try {
    const category = await dispatch('category/single', { key: 'url_path', value: url }, { root: true })
    if (category !== null) {
      console.log('category.slug', category.slug)
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
    async mappingFallback ({ dispatch }, { url, params }: { url: string, params: any}) {
      url = (removeStoreCodeFromRoute(url) as string)
      const product = await forProduct({ dispatch }, url, params)
      if (product) {
        return product
      }
      const category = await forCategory({ dispatch }, url)
      if (category) {
        return category
      }
      return {
        name: 'storyblok',
        params: {
          slug: 'toppar'
        }
      }
    }
  }
}

export const urlExtend = {
  key: 'url',
  store: { modules: [{ key: 'url', module: extendUrlVuex }] },
}
