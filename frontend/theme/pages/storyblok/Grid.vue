<template>
  <div class="row">
    <div v-for="_item in item.columns" :key="_item.uuid" class="col-xs-12 col-lg-6">
      <sb-render class="box" :item="_item" />
    </div>
  </div>
</template>

<script>
import Blok from './Blok'
export default {
  name: 'GridBlok',
  extends: Blok
}
</script>
