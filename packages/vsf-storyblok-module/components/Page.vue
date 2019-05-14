<template>
  <div>
    <template v-for="child in item.body">
      <sb-render :item="child" :key="child.uuid" />
    </template>
  </div>
</template>

<script>
import Blok from './Blok'
export default {
  extends: Blok,
  name: 'PageBlok'
}
</script>
