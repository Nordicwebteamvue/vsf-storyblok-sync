<template>
  <div v-editable="item">
    <component v-if="component" :is="component" :item="item" />
  </div>
</template>

<script>
import { components } from './'

export default {
  name: 'RenderBlok',
  computed: {
    component: function () {
      return components[this.item.component] || components.debug
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
