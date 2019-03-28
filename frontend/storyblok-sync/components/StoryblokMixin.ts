import { mapGetters } from 'vuex'
import qs from 'qs'

export default {
  name: 'Storyblok',
  computed: {
    ...mapGetters({
      story: 'storyblok/getStory',
      isLoading: 'storyblok/isLoading',
    })
  },
  asyncData ({ store, route, context }) {
    const paramString = route.fullPath.replace(route.path, '');
    const params = qs.parse(paramString, { ignoreQueryPrefix: true });
    if (params._storyblok) {
      // Fetch from storyblok
      return new Promise((resolve, reject) => {
        store.dispatch('storyblok/loadPreviewAsync', {
          id: params._storyblok,
          timestamp: params._storyblok_tk.timestamp,
          spaceId: params.space_id
        }).then(story => {
          resolve({story});
        }).catch(err => {
          console.error(err)
          reject(err)
        })
      })
    }
    return new Promise((resolve, reject) => {
      // Fetch from API
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
