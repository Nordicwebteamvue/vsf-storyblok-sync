<template>
  <img v-if="lazy" :class="classes" v-lazy="image">
  <img v-else :class="classes" :src="image">
</template>

<script>
export default {
  name: 'StoryblokImage',
  computed: {
    image () {
      const { images } = this.$store.state.config
      const src = this.src.substring(0, 2) === '//' ? `https:${this.src}` : this.src
      const imageUrl = `${images.baseUrl}?width=${this.width}&height=${this.height}&action=fit&url=${src}`
      return imageUrl
    }
  },
  props: {
    height: {
      type: Number,
      default: 800
    },
    width: {
      type: Number,
      default: 600
    },
    src: {
      type: String,
      required: true
    },
    lazy: {
      type: Boolean,
      default: true
    },
    classes: {
      type: [String, Array, Object],
      default: ''
    }
  }
}
</script>
