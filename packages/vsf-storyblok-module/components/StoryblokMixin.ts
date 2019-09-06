import config from 'config'
import { mapState } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { KEY } from '..'
import { StoryblokState } from '../types/State'
import { loadScript, getStoryblokQueryParams } from '../helpers'
import has from 'lodash-es/has'

export default {
  name: 'Storyblok',
  metaInfo () {
    if (!this.isStatic && this.story) {
      return {
        title: has(this.story.content, 'seo.title') && this.story.content.seo.title ? this.story.content.seo.title : this.story.name,
        meta: has(this.story.content, 'seo.description') && this.story.content.seo.description ? [{ vmid: 'description', name: 'description', content: this.story.content.seo.description }] : []
      }
    }
    return {}
  },
  computed: {
    ...mapState(KEY, {
      loadingStory(state: StoryblokState) {
        const { id, fullSlug } = getStoryblokQueryParams(this.$route)

        const key = this.storyblokPath || id || fullSlug
        return state.stories[key] && state.stories[key].loading || false
      },
      previewToken: (state: StoryblokState) => state.previewToken,
      story(state: StoryblokState) {
        const { id, fullSlug } = getStoryblokQueryParams(this.$route)

        const key = this.storyblokPath || id || fullSlug
        return state.stories[key] && state.stories[key].story
      },
      isStatic() {
        return !!this.storyblok.path
      },
      storyblokPath() {
        const {storeCode} = currentStoreView()
        const path = this.storyblok.path
        if (this.storyblok.prependStorecode && config.storeViews.multistore && storeCode) {
          return `${storeCode}/${path}`
        }
        return path
      }
    }),
  },
  data () {
    return {
      storyblok: {
        prependStorecode: false,
        path: '',
      }
    }
  },
  methods: {
    async fetchStory () {
      const { id, fullSlug, spaceId, timestamp, token } = getStoryblokQueryParams(this.$route)

      if (id && !this.storyblokPath) {
        const previewToken = await this.$store.dispatch(`${KEY}/getPreviewToken`, {
          spaceId,
          timestamp,
          token
        })

        if (previewToken) {
          return this.$store.dispatch(`${KEY}/loadDraftStory`, {
            id,
            previewToken
          })
        }
      }

      return this.$store.dispatch(`${KEY}/loadStory`, {
        fullSlug: this.storyblokPath || fullSlug
      })
    }
  },
  async asyncData ({ store, route, context }) {
    const { id, fullSlug } = getStoryblokQueryParams(route)

    if (context && !id) {
      context.output.cacheTags.add(KEY)
    }

    const story = await store.dispatch(`${KEY}/loadStory`, { fullSlug })

    return { story }
  },
  async mounted () {
    if (!this.story) {
      await this.fetchStory()
    }

    if (this.previewToken) {
      const url = `https://app.storyblok.com/f/storyblok-latest.js?t=${this.previewToken}`

      await loadScript(url, 'storyblok-javascript-bridge')

      window['storyblok'].on(['input', 'published', 'change'], (event: any) => {
        if (event.action === 'input') {
          this.$store.commit(`${KEY}/updateStory`, { key: event.story.id, story: event.story })
        } else if (!(event).slugChanged) {
          window.location.reload()
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (!this.isStatic && from.path !== to.path) {
        this.fetchStory()
      }
    }
  }
}
