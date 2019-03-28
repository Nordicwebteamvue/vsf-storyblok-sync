<template>
  <div>
    <template v-for="_item in item.body">
      <sb-render :item="_item" :key="_item.uuid" />
    </template>
  </div>
</template>

<script>
import Blok from './Blok'
export default {
  name: 'Page',
  extends: Blok
}
</script>
