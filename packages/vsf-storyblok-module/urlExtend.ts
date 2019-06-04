import { actions } from '@vue-storefront/core/modules/url/store/actions'
import { ActionTree } from 'vuex';
import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'
import { removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'

// 1. Preparation of new VSMConfig
const extendUrlVuex = {
 actions: {
   async mappingFallback ({ dispatch }, { url, params }) {
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
     } else {
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
       } catch(e) {
         return {
           name: 'storyblok'
         }
       }
     }
   }
 }
}

export const urlExtend = {
  key: 'url',
  store: { modules: [{ key: 'url', module: extendUrlVuex }] },
}
