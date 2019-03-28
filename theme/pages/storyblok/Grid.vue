<template>
  <div class="row">
    <div v-for="_item in item.columns" :key="_item.uuid" class="col-xs-12 col-lg-6">
      <sb-render class="box" :item="_item" />
    </div>
  </div>
</template>

<script>
import SbRender from './Render.vue'
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
