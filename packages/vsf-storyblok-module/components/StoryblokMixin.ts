import config from 'config'
import fetch from 'isomorphic-fetch'
import { mapGetters, mapState } from 'vuex'
import qs from 'qs'
import { KEY } from ".."
import { StoryblokState } from '../types/State';

function loadScript (src, id) {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve()
      return
    }
    var script = document.createElement('script')
    script.async = true
    script.src = src
    script.id = id
    script.onerror = function onError () {
      reject(new Error('Failed to load' + src))
    }
    script.onload = function onLoad () {
      resolve()
    }
    document.getElementsByTagName('head')[0].appendChild(script)
  })
}

function getStoryblokQuery (route, path = route.path) {
  const queryString = route.fullPath.replace(route.path, '')
  const { _storyblok: id, _storyblok_c: c, _storyblok_tk: storyblok = {} } = qs.parse(queryString, { ignoreQueryPrefix: true })
  const { space_id: spaceId, timestamp, token } = storyblok

  return {
    c,
    id,
    slug: path,
    spaceId,
    timestamp,
    token
  }
}

export default {
  name: 'Storyblok',
  computed: {
    ...mapState(KEY, {
      story(state: StoryblokState) {
        const { id, slug } = getStoryblokQuery(this.$route, this.storyblokPath)
        const key = this.storyblokPath || id || slug
        console.log({key})
        return state.stories[key] && state.stories[key].story
      }
    }),
    ...mapGetters([
      'isLoading',
      'previewToken'
    ])
  },
  methods: {
    async fetchStory () {
      const { id, spaceId, timestamp, slug, token } = getStoryblokQuery(this.$route, this.storyblokPath)

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
        slug
      })
    }
  },
  async serverPrefetch () {
    const { id } = getStoryblokQuery(this.$route, this.storyblokPath)

    if (this.$context && !id) {
      this.$context.output.cacheTags.add(KEY)
    }

    const story = await this.fetchStory()

    return { story }
  },
  async mounted () {
    if (!this.story) {
      const { full_slug } = this.fetchStory()
      this.storyblokPath = full_slug;
    }

    if (this.previewToken) {
      // TODO: Make sure we don't load this multiple times
      const url = `https://app.storyblok.com/f/storyblok-latest.js?t=${this.previewToken}`

      await loadScript(url, 'storyblok-javascript-bridge')

      window['storyblok'].on(['input', 'published', 'change'], (event: any) => {
        if (event.action === 'input') {
          this.$store.commit(`${KEY}/updateStory`, {story: event.story})
        } else if (!(event).slugChanged) {
          window.location.reload()
        }
      })
    }
  }
}
