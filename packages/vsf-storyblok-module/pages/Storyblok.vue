<template>
  <sb-render v-if="story && story.content" :item="story.content"/>
</template>

<script>
import config from 'config'
import get from 'lodash.get'
import { getSettings } from '../helpers'
import { storeCodeFromRoute } from '@vue-storefront/core/lib/multistore'
import StoryblokMixin from '../components/StoryblokMixin'

export default {
  name: 'StoryblokPage',
  mixins: [StoryblokMixin],
  metaInfo () {
    const {hreflangPrefix} = getSettings(config.storyblok.settings)
    if (hreflangPrefix && this.story && this.story.alternates.length > 0) {
      const mappingStoreCodeConfig = config.storyblok.mappingStoreUrl
      const metaInfo = {
        link: this.story.alternates.map(link => {
          let fullSlug = link.full_slug
          mappingStoreCodeConfig.forEach((mapStoreConfig) => {
            if (link.full_slug.includes(mapStoreConfig.storyblok_code)) {
              fullSlug = link.full_slug.replace(mapStoreConfig.storyblok_code, mapStoreConfig.m2_store_code)
            }
          })
          const storeCode = storeCodeFromRoute(fullSlug)
          const locale = get(config.storeViews, [storeCode, 'i18n/defaultLocale'], storeCode)
          return {
            rel: 'alternate',
            hreflang: locale,
            href: hreflangPrefix + link.full_slug
          }
        })
      }
      return metaInfo
    }
    return {}
  }
}
</script>
