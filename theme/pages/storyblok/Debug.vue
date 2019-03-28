<template>
  <div v-editable="item">
    Missing component <strong>{{ item.component }}</strong>
    <pre>{{ item | pretty }}</pre>
  </div>
</template>

<script>
export default {
  name: 'SbDebug',
  computed: {
    isEditable: function () {
      return process.env.VS_ENV === 'dev'
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
