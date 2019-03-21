<template>
  <div class="sb-image" :style="{ backgroundImage: `url(${item.url})` }">a</div>
</template>

<script>
import SbRender from 'src/modules/storyblok-sync/components/SbRender.vue'
export default {
  name: 'SbGrid',
  components: {
    sbRender: SbRender
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.sb-image {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 500px;
}
</style>
