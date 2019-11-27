<template>
  <router-link v-if="link && link.linktype === 'story'" :to="url">
    <slot />
  </router-link>
  <a :href="link.url" v-else-if="link && link.url">
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
    url () {
      let url = `/${this.link.cached_url}`
      const addStoreCode = get(config, 'storyblok.settings.appendStoreCodeFromHeader')
      if (this.link.linktype === 'story') {
        if (addStoreCode && this.storeCodeFromHeader && url.startsWith(`/${this.storeCodeFromHeader}`)) {
          return url.replace(`/${this.storeCodeFromHeader}`, '')
        }
        return url
      }
      return this.link.url
    }
  }
}
</script>
