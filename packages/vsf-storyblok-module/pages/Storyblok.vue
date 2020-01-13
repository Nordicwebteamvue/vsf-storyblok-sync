<template>
  <sb-render v-if="story && story.content" :item="story.content"/>
</template>

<script>
import config from 'config'
import get from 'lodash.get'
import { getSettings } from '../helpers'
import storeCodeFromRoute from '@vue-storefront/core/lib/storeCodeFromRoute'
import StoryblokMixin from '../components/StoryblokMixin'

export default {
  name: 'StoryblokPage',
  mixins: [StoryblokMixin],
  metaInfo () {
    const {hreflangPrefix} = getSettings(config.storyblok.settings)
    if (hreflangPrefix && this.story && this.story.alternates.length > 0) {
      const metaInfo = {
        link: this.story.alternates.filter(link => {
          const storeCode = this.storeCodeFromSlug(link.full_slug)
          return get(config.storeViews, [storeCode, 'disabled'], true) === false
        })
        .map(link => {
          const storeCode = this.storeCodeFromSlug(link.full_slug)
          const locale = get(config.storeViews, [storeCode, 'i18n/defaultLocale'], storeCode)
          const tldPrefix = get(config.storeViews, [storeCode, 'tld'], undefined)
          const href = tldPrefix ? tldPrefix + '/' + this.removeStoreCodeFromSlug(link.full_slug) : hreflangPrefix + link.full_slug
          return {
            rel: 'alternate',
            hreflang: locale,
            href: href
          }
        })
      }
      return metaInfo
    }
    return {}
  },
  methods: {
    storeCodeFromSlug (slug) {
      return slug.split(/\/(.+)/)[0]
    },
    removeStoreCodeFromSlug(slug) {
      return slug.split(/\/(.+)/)[1]
    }
  }
}
</script>
