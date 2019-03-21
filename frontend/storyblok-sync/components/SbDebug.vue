<template>
  <div v-if="isEditable" v-editable="item">
    Missing component <strong>{{ item.component }}</strong>
    <pre>{{ item | pretty }}</pre>
  </div>
</template>

<script>
import { isServer } from '@vue-storefront/core/helpers'
export default {
  name: 'SbDebug',
  computed: {
    isEditable: function () {
      return !isServer && window.location.search.includes('?_storyblok=')
    }
  },
  filters: {
    pretty ({_editable, _uid, ...value}) {
      return JSON.stringify(value, null, 2)
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

<style lang="scss" scoped>
.sb-image {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 500px;
}
</style>
