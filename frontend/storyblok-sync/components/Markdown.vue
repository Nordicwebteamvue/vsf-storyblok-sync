<template>
  <div v-html="compiledMarkdown" />
</template>

<script>
import marked from 'marked'
export default {
  computed: {
    compiledMarkdown: function () {
      return marked(this.input, { sanitize: true })
    }
  },
  props: {
    input: {
      type: String,
      required: true
    }
  }
}
</script>
