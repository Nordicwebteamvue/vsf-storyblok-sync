<template>
  <div class="image" :style="{ backgroundImage: `url(${item.url})` }" />
</template>

<script>
import { Blok } from '@kodbruket/vsf-storyblok-module/components'
export default {
  name: 'ImageBlok',
  extends: Blok
}
</script>

<style lang="scss" scoped>
.image {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 500px;
}
</style>
