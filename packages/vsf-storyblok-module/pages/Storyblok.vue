<template>
  <sb-render v-if="story && story.content" :item="story.content"/>
</template>

<script>
import config from 'config'
import get from 'lodash.get'
import { getSettings } from '../helpers'
import { storeCodeFromRoute } from '@vue-storefront/core/lib/multistore'
import StoryblokMixin from '../components/StoryblokMixin'
import Render from '../components/Render.vue'

export default {
  name: 'StoryblokPage',
  mixins: [StoryblokMixin],
  components: {
    sbRender: Render
  },
  metaInfo () {
    const {hreflangPrefix} = getSettings(config.storyblok.settings)
    if (hreflangPrefix && this.story && this.story.alternates.length > 0) {
      const metaInfo = {
        link: this.story.alternates.map(link => {
          const storeCode = storeCodeFromRoute(link.full_slug)
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
