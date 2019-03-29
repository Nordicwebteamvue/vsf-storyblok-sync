<template>
  <div>
    Missing component <strong>{{ item.component }}</strong>
    <pre>{{ item | pretty }}</pre>
  </div>
</template>

<script>
import Blok from './Blok'
export default {
  name: 'DebugBlok',
  extends: Blok,
  computed: {
    isEditable: function () {
      return process.env.VS_ENV === 'dev'
    }
  },
  filters: {
    pretty ({_editable, _uid, ...value}) {
      return JSON.stringify(value, null, 2)
    }
  }
}
</script>
