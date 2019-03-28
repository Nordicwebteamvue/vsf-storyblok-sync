import Render from './Render.vue'
export default {
  name: 'BlokBase',
  components: {
    sbRender: Render
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
