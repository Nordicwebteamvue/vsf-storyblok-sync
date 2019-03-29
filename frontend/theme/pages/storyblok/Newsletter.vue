<template>
  <form @submit.prevent="submit(onSuccesfulSubmission)" novalidate>
    <div class="mb35">
      <p>
        {{ item.title }}
      </p>
      <base-input
        focus
        type="email"
        name="email"
        v-model="email"
        autocomplete="email"
        :placeholder="item.placeholder"
        :validations="[
          {
            condition: $v.email.$error && !$v.email.required,
            text: $t('Field is required.')
          },
          {
            condition: !$v.email.email && $v.email.$error,
            text: $t('Please provide valid e-mail address.')
          }
        ]"
      />
    </div>
    <button-full
      class="mb35"
      type="submit"
      :disabled="this.$v.$invalid"
      @click.native="$v.email.$touch"
    >
      {{ item.cta }}
    </button-full>
  </form>
</template>

<script>
import { Subscribe } from 'src/modules/mailchimp/components/Subscribe'
import i18n from '@vue-storefront/i18n'

import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput.vue'
import Blok from './Blok'

export default {
  beforeDestroy () {
    this.$off('validation-error')
  },
  name: 'NewsletterBlok',
  extends: Blok,
  methods: {
    onSuccesfulSubmission () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: i18n.t('You have been successfully subscribed to our newsletter!'),
        action1: { label: i18n.t('OK') }
      })
    }
  },
  components: {
    ButtonFull,
    BaseInput
  },
  mixins: [
    Subscribe
  ]
}
</script>

<style lang="scss" scoped>
form {
  height: 480px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #ffe7e5;
}
</style>
