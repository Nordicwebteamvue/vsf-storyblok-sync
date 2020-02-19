<template>
  <sb-img :src="item.image" :width="1200" :lazy="true" />
</template>

<script>
import { Blok } from 'src/modules/vsf-storyblok-module/components'
export default {
  name: 'ImageBlok',
  extends: Blok
}
</script>
