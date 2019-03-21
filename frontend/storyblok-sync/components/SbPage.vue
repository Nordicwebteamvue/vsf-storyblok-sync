<template>
  <div v-if="item.component === 'page'">
    <div v-for="_item in item.body" :key="_item.uuid">
      <sb-render :item="_item" />
    </div>
  </div>
</template>

<script>
import SbRender from 'src/modules/storyblok-sync/components/SbRender.vue'
export default {
  name: 'SbPage',
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
