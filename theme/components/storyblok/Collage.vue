<template>
  <div class="wrapper">
    <sb-img
      class="tile"
      v-for="image in images"
      :key="image.image"
      :src="image.image"
      :pinterest="true"
      :lazy="true"
      :div="true"
      :width="400"
    />
  </div>
</template>

<script>
import { Blok } from 'src/modules/vsf-storyblok-module/components'
export default {
  name: 'CollageBlok',
  extends: Blok,
  computed: {
    images () {
      return [...this.item.images]
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-wrap: wrap;
}
.tile {
  width: 33%;
  padding-top: calc(56.25% / 3);
  @media (max-width: 992px) {
    width: 50%;
    padding-top: calc(56.25% / 2);
  }
  @media (max-width: 600px) {
    width: 100%;
    padding-top: 56.25%;
  }
  position: relative;
  // flex-grow: 1;
  background-size: cover;
}
</style>
