export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  filters: {
    pretty (value) {
      return value
    }
  },
  metaInfo: {
    meta: [
      { charset: 'utf-8' }
    ]
  }
}
