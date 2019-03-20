import { mapGetters } from 'vuex'

export default {
  name: 'Storyblok',
  computed: {
    ...mapGetters({
      story: 'storyblok/getStory',
      isLoading: 'storyblok/isLoading',
    })
  },
  asyncData ({ store, route, context }) {
    return new Promise((resolve, reject) => {
      store.dispatch('storyblok/loadAsync', {
        id: route.fullPath
      }).then(story => {
        if (context) context.output.cacheTags.add(`storyblok`)
        resolve({story})
      }).catch(err => {
        console.error(err)
        reject(err)
      })
    })
  },
  methods: {
  }
}
