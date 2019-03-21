<template>
  <div class="container" v-editable="item">
    <component v-if="component" :is="component" :item="item" />
  </div>
</template>

<script>
export default {
  name: 'SbRender',
  computed: {
    component: function () {
      return this.components[this.item.component] || this.components.debug
    },
    components: function () {
      return {
        debug: () => import('./SbDebug.vue'),
        page: () => import('./SbPage.vue'),
        grid: () => import('./SbGrid.vue'),
        image: () => import('./SbImage.vue'),
        // tile: () => import('theme/components/theme/blocks/Storyblok/SbTile.vue'),
        // 'text-section': () => import('theme/components/theme/blocks/Storyblok/SbTextSection.vue'),
        // newsletter: () => import('theme/components/theme/blocks/Storyblok/SbNewsletter.vue')
      }
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
