<template>
  <div v-if="div" :style="{ backgroundImage: 'url(\'' + image + '\')' }">
    <slot />
  </div>
  <img v-else-if="lazy" v-lazy="image">
  <img v-else :src="image">
</template>

<script>
export default {
  name: 'StoryblokImage',
  computed: {
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
        if (this.filters.length > 0) {
          mod += '/filters:' + this.filters.join(':')
        }
      }

      return 'https://img2.storyblok.com' + mod + resource
    }
  },
  props: {
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
