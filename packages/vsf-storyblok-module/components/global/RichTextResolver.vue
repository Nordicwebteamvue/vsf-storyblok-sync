<template>
  <div v-html="html" />
</template>

<script>

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
      return this.$storyblokClient.richTextResolver.render(this.richText)
    }
  }
}
</script>
