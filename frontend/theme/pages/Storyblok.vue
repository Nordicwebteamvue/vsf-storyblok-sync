<template>
  <div>
    <sb-render v-if="story" :item="story.content" />
  </div>
</template>

<script>
import StoryblokMixin from 'src/modules/storyblok-sync/components/StoryblokMixin'
import Render from './storyblok/Render.vue'

export default {
  name: 'StoryblokPage',
  mixins: [StoryblokMixin],
  components: {
    sbRender: Render
  }
}
</script>
