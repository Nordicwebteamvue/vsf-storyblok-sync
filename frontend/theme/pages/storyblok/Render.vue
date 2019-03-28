<template>
  <component v-editable="item" v-if="component" :is="component" :item="item" />
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'Render',
  computed: {
    component: function () {
      return this.components[this.item.component] || this.components.debug
    },
    components: function () {
      return {
        debug: () => import('./Debug.vue'),
        page: () => import('./Page.vue'),
        grid: () => import('./Grid.vue'),
        image: () => import('./Image.vue'),
        hero: () => import('./Hero.vue')
      }
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  }
})
</script>
