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
    const isEditing = !!params._storyblok;
    const dispatch = isEditing ? store.dispatch('storyblok/loadPreviewAsync', {
      id: params._storyblok,
      timestamp: params._storyblok_tk.timestamp,
      spaceId: params.space_id
    }) : store.dispatch('storyblok/loadStoryAsync', {
      id: route.fullPath
    })
    return dispatch.then(story => {
      if (context && !isEditing) {
        context.output.cacheTags.add(`storyblok`)
      }
      return {story}
    })
  },
  methods: {
  }
}
