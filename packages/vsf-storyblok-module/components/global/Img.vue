<template>
  <div v-if="div && lazy" class="bg">
    <img class="lazyload" :src="placeholderSrc" :data-src="getSrc()" :width="intrinsicWidth" :height="intrinsicHeight" :alt="alt">
    <div class="slot">
      <slot />
    </div>
  </div>
  <div v-else-if="div" class="bg">
    <img :src="getSrc()" :width="intrinsicWidth" :height="intrinsicHeight" :alt="alt">
    <div class="slot">
      <slot />
    </div>
  </div>
  <img v-else-if="lazy" class="lazyload" :data-src="getSrc()" :src="placeholderSrc" :width="intrinsicWidth" :height="intrinsicHeight" :alt="alt">
  <img v-else :src="getSrc()" :width="intrinsicWidth" :height="intrinsicHeight" :alt="alt">
</template>

<script>

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
    },
    isSvg () {
      return this.src.endsWith('.svg')
    }
  },
  methods: {
    getSrc (format) {
      if (this.isSvg || !this.src.includes('//a.storyblok.com')) {
        return this.src
      }
      let mods = []
      if (this.height > 0 || this.width > 0) {
        if (this.fitIn) {
          mods.push('fit-in')
        }
        mods.push(`/${this.width}x${this.height}`)
        if (this.smart) {
          mods.push('smart')
        }
      }
      if (this.filters.length > 0) {
        mods.push('filters:' + this.filters.join(':'))
      }
      return this.src + '/m/' + mods.join('/')
    }
  },
  props: {
    placeholder: {
      type: String,
      default: ''
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
    },
    alt: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  img {
    width: 100%;
    height: auto;
    display: block;
  }
  .bg {
    overflow: hidden;
    position: relative;
    img {
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
      height: 100%;
      width: 100%;
      top: 50% !important;
      transform: translate(0,-50%);
      mix-blend-mode: multiply;
    }
    .slot{
      position: relative;
    }
  }
</style>
