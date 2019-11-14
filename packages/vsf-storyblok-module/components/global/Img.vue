<template>
  <div v-if="div && lazy" v-lazy:background-image="image">
    <slot />
  </div>
  <div v-else-if="div" :style="{ backgroundImage: 'url(\'' + image + '\')' }">
    <slot />
  </div>
  <img v-else-if="lazy" v-lazy="image">
  <img v-else :src="image">
</template>

<script>
import { isServer } from '@vue-storefront/core/helpers'
function canUseWebP () {
  if (isServer) {
    return true
  }

  const elem = document.createElement('canvas')
  if ((elem.getContext && elem.getContext('2d'))) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }

  return false
}

export default {
  name: 'StoryblokImage',
  computed: {
    computedFilters () {
      if (this.detectWebp && canUseWebP()) {
        return [...this.filters, 'format(webp)']
      }
      return this.filters
    },
    image () {
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
      if (this.computedFilters.length) {
        mod += '/filters:' + this.computedFilters.join(':')
      }
      return 'https://img2.storyblok.com' + mod + resource
    }
  },
  props: {
    detectWebp: {
      type: Boolean,
      default: true
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
