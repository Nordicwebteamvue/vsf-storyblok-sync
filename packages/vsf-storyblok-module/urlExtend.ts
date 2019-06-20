import { forCategory, forProduct, forStoryblok } from './mappingFallback'

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
    }
  }
}

export const urlExtend = {
  key: 'url',
  store: { modules: [{ key: 'url', module: extendUrlVuex }] },
}
