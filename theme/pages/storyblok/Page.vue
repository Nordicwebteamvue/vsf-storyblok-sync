<template>
  <div v-if="item.component === 'page'">
    <template v-for="_item in item.body">
      <sb-render :item="_item" :key="_item.uuid" />
    </template>
  </div>
</template>

<script>
import SbRender from './Render.vue'
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
