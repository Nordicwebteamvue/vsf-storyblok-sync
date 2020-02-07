<template>
  <div>
    <slot v-if="loading" name="loading"></slot>
    <slot v-else></slot>
  </div>
</template>

<script>
import config from 'config'
import { TaskQueue } from '@vue-storefront/core/lib/sync'

export default {
  name: 'StoryblokCms',
  data () {
    return {
      loading: true,
    }
  },
  props: {
    uuid: {
      type: String,
      required: true,
    },
    value: true
  },
  methods: {
    updateValue: function (value) {
      this.$emit('input', value);
    },
    async fetchStory () {
      const url = `${config.storyblok.endpoint}/get-by-uuid?uuid=${this.uuid}`
      const { result: { story }} = await TaskQueue.execute({
        url,
        payload: {
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors'
        },
        silent: true
      })
      this.updateValue(story)
    }
  },
  async serverPrefetch () {
    const story = await this.fetchStory()
    return { story }
  },
  async mounted () {
    if (!this.story) {
      await this.fetchStory()
    }

    if (this.previewToken) {
      const url = `https://app.storyblok.com/f/storyblok-latest.js?t=${this.previewToken}`

      await loadScript(url, 'storyblok-javascript-bridge')

      window['storyblok'].on(['input', 'published', 'change'], (event) => {
        if (event.action === 'input') {
          this.updateValue(event.story)
        }
      })
    }
  },
}
</script>
