<template>
  <div ref="element" v-if="div && lazy" v-lazy:background-image="image" :style="{ backgroundImage: `url('${placeholder}')` }">
    <slot />
  </div>
  <div ref="element" v-else-if="div" :style="{ backgroundImage: `url('${image}')` }">
    <slot />
  </div>
  <img v-else-if="lazy" v-lazy="image" :src="placeholder">
  <img v-else :src="image">
</template>

<script>
import get from 'lodash-es/get'
import config from 'config'
import { mapGetters } from 'vuex'
import debounce from 'lodash-es/debounce'

const baseUrl = 'https://img2.storyblok.com'

export default {
  name: 'StoryblokImage',
  data () {
    return {
      elementWidth: 0
    }
  },
  mounted () {
    if (this.div && this.useElementWidth) {
      this.elementWidth = this.$refs.element.offsetWidth
      window.addEventListener('resize', debounce(this.onResize, 250))
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', debounce(this.onResize, 250))
  },
  methods: {
    onResize () {
      this.elementWidth = this.$refs.element.offsetWidth
    },
    createUrl (url, filters = [], { pinterest } = {}) {
      const [, resource] = url.split('//a.storyblok.com')
      let mod = ''
      // const width = this.useElementWidth ? this.elementWidth : this.width
      if (pinterest) {
        return baseUrl + '/1x1' + resource
      }
      if (this.height > 0 || this.width > 0 || this.useElementWidth) {
        if (this.fitIn) {
          mod += '/fit-in'
        }
        if (this.useElementWidth) {
          mod += `/${this.elementWidth}x0`
        } else {
          mod += `/${this.width}x${this.height}`
        }
        if (this.smart) {
          mod += '/smart'
        }
      }
      if (filters.length) {
        mod += '/filters:' + filters.join(':')
      }
      return baseUrl + mod + resource
    }
  },
  computed: {
    ...mapGetters({
      supportsWebp: 'storyblok/supportsWebp'
    }),
    computedFilters () {
      if (this.detectWebp && this.supportsWebp) {
        return [...this.filters, 'format(webp)']
      }
      return this.filters
    },
    image () {
      if (!this.src.includes('//a.storyblok.com')) {
        return this.src
      }
      if (this.pinterest && this.lazy) {
        return {
          src: this.createUrl(this.src, this.computedFilters),
          error: this.src,
          loading: this.createUrl(this.src, this.computedFilters, { pinterest: true })
        }
      }
      return this.createUrl(this.src, this.computedFilters)
    }
  },
  props: {
    placeholder: {
      type: String,
      default: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
    },
    pinterest: {
      type: Boolean,
      default: false
    },
    useElementWidth: {
      type: Boolean,
      default: false
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
