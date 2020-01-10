<template>
  <router-link v-if="!isExternal" :to="url">
    <slot />
  </router-link>
  <a v-else :href="url" rel="noopener noreferrer">
    <slot />
  </a>
</template>

<script>
import { mapState } from 'vuex'
import config from 'config'
import get from 'lodash-es/get'

export default {
  name: 'StoryblokRouterLink',
  props: {
    link: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState('storyblok', {
      storeCodeFromHeader: (state) => state.storeCode
    }),
    isExternal () {
      if (this.link && this.link.linktype === 'story') {
        return true
      }
      return /^((http|https|ftp):\/\/)/.test(this.url)
    },
    url () {
      let url = this.link.cached_url || this.link.url
      const addStoreCode = get(config, 'storyblok.settings.appendStoreCodeFromHeader')
      if (addStoreCode && this.storeCodeFromHeader && url.startsWith(`/${this.storeCodeFromHeader}`)) {
        return url.replace(`/${this.storeCodeFromHeader}`, '')
      }
      return url
    }
  }
}
</script>
