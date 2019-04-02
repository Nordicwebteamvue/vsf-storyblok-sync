<template>
  <div>
    <sb-render v-if="story" :item="story.content"/>
  </div>
</template>

<script>
import StoryblokMixin from "src/modules/vsf-storyblok-module/components/StoryblokMixin";
import Render from "src/modules/vsf-storyblok-module/components/Render.vue";
export default {
  name: "StoryblokPage",
  mixins: [StoryblokMixin],
  components: {
    sbRender: Render
  }
};
</script>
