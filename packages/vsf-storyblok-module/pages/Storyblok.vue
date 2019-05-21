<template>
  <sb-render v-if="story && story.content" :item="story.content"/>
</template>

<script>
import StoryblokMixin from '../components/StoryblokMixin'
import Render from '../components/Render.vue'
export default {
  name: 'StoryblokPage',
  mixins: [StoryblokMixin],
  components: {
    sbRender: Render
  }
}
</script>
