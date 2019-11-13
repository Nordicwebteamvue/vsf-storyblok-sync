<template>
  <div v-html="html" />
</template>

<script>
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import Vue from 'vue'

export default {
  name: 'RichTextResolver',
  props: {
    richText: {
      type: Object,
      required: true
    }
  },
  computed: {
    html () {
      return Vue.prototype.$storyblokClient.richTextResolver.render(this.richText)
    }
  }
}
</script>
