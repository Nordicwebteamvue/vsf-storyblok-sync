<template>
  <div class="sb-image" :style="{ backgroundImage: `url(${item.url})` }">a</div>
</template>

<script>
export default {
  name: 'SbGrid',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.sb-image {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 500px;
}
</style>
