<template>
  <div v-if="div && lazy" class="lazyload" :data-bg="getSrc()" :style="{ backgroundImage: `url('${placeholderSrc}')` }">
    <slot />
  </div>
  <div v-else-if="div" :style="{ backgroundImage: `url('${getSrc()}')` }">
    <slot />
  </div>
  <picture v-else-if="lazy">
    <source :data-srcset="getSrc('webp')" type="image/webp">
    <img class="lazyload" :data-src="getSrc()" :src="placeholderSrc" :width="intrinsicWidth" :height="intrinsicHeight">
  </picture>
  <picture v-else>
    <source :srcset="getSrc('webp')" type="image/webp">
    <img :src="getSrc()" :width="intrinsicWidth" :height="intrinsicHeight">
  </picture>
</template>

<script>
import get from 'lodash-es/get'
import config from 'config'

export default {
  name: 'StoryblokImage',
  computed: {
    intrinsicWidth () {
      return this.intrinsicSize?.width
    },
    intrinsicHeight () {
      return this.intrinsicSize?.height
    },
    intrinsicSize () {
      try {
        const widthHeight = this.src.match(/\d+x\d+/g)[0].split('x')
        return {
          width: widthHeight[0],
          height: widthHeight[1]
        }
      } catch (e) {
        return undefined
      }
    },
    placeholderSrc () {
      return this.placeholder || `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.intrinsicWidth} ${this.intrinsicHeight}"%3E%3C/svg%3E`
    }
  },
  methods: {
    getSrc (format) {
      if (!this.src.includes('//a.storyblok.com')) {
        return this.src
      }
      const [, resource] = this.src.split('//a.storyblok.com')
      let mod = ''
      if (this.height > 0 || this.width > 0) {
        if (this.fitIn) {
          mod += '/fit-in'
        }
        mod += `/${this.width}x${this.height}`
        if (this.smart) {
          mod += '/smart'
        }
      }
      if (format === 'webp') {
        mod += '/filters:format(webp)'
      }
      return 'https://img2.storyblok.com' + mod + resource
    }
  },
  props: {
    placeholder: {
      type: String
    },
    detectWebp: {
      type: Boolean,
      default: get(config, 'storyblok.imageService.defaultWebp', true)
    },
    height: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    src: {
      type: String,
      required: true
    },
    div: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: true
    },
    smart: {
      type: Boolean,
      default: false
    },
    fitIn: {
      type: Boolean,
      default: false
    },
    filters: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
  img {
    width: 100%;
    height: auto;
  }
</style>
