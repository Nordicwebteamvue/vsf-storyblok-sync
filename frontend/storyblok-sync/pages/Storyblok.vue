<template>
  <div>
    <sb-render v-if="story" :item="story.content" />
  </div>
</template>

<script>
import StoryblokMixin from 'src/modules/storyblok-sync/components/StoryblokMixin'
import SbRender from 'src/modules/storyblok-sync/components/SbRender.vue'
export default {
  name: 'StoryblokPage',
  mixins: [StoryblokMixin],
  components: {
    sbRender: SbRender
  }
}
</script>
