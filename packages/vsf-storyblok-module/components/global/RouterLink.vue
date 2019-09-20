<template>
  <router-link v-if="link && link.linktype === 'story'" :to="'/' + link.cached_url">
    <slot />
  </router-link>
  <a :href="link.url" v-else-if="link && link.url">
    <slot />
  </a>
</template>

<script>
export default {
  name: 'StoryblokRouterLink',
  props: {
    link: {
      type: Object,
      required: true
    }
  }
}
</script>
