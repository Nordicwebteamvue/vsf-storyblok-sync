<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="html" />
</template>

<script>
export default {
  name: 'RichText',
  props: {
    text: {
      type: Object,
      required: true
    }
  },
  computed: {
    html () {
      return this.$storyblokClient.richTextResolver.render(this.text)
    }
  }
}
</script>
