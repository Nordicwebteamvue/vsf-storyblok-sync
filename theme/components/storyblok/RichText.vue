<template>
  <div>
    <sb-rich-text v-if="item.text" :text="item.text" />
  </div>
</template>

<script>
import { Blok } from 'src/modules/vsf-storyblok-module/components'
export default {
  name: 'RichTextBlok',
  extends: Blok
}
</script>
