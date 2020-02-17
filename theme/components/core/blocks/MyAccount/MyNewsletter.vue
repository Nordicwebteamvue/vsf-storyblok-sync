<template>
  <div class="mb35">
    <!-- My newsletter header -->
    asd
  </div>
</template>

<script>
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import BaseCheckbox from '../Form/BaseCheckbox.vue'

export default {
  components: {
    ButtonFull,
    BaseCheckbox
  },
  data () {
    return {
      isEdited: false
    }
  },
  methods: {
    exitSection () {
      this.isEdited = false
    },
    edit () {
      this.isEdited = true
    }
  }
}
</script>
