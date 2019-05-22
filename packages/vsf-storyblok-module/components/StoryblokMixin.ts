import config from 'config'
import fetch from 'isomorphic-fetch'
import { mapGetters } from 'vuex'
import qs from 'qs'

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

function getStoryblokQuery (route) {
  const queryString = route.fullPath.replace(route.path, '')
  const { _storyblok: id, _storyblok_c: c, _storyblok_tk: storyblok = {} } = qs.parse(queryString, { ignoreQueryPrefix: true })
  const { space_id: spaceId, timestamp, token } = storyblok

  return {
    c,
    id,
    slug: route.path,
    spaceId,
    timestamp,
    token
  }
}

export default {
  name: 'Storyblok',
  computed: {
    ...mapGetters({
      isLoading: 'storyblok/isLoading',
      previewToken: 'storyblok/getPreviewToken',
      story: 'storyblok/getStory'
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchStory()
    next();
  },
  methods: {
    async fetchStory () {
      const { id, spaceId, timestamp, slug, token } = getStoryblokQuery(this.$route)

      if (id) {
        const previewToken = await this.$store.dispatch('storyblok/getPreviewToken', {
          spaceId,
          timestamp,
          token
        })

        if (previewToken) {
          return this.$store.dispatch('storyblok/loadDraftStory', {
            id,
            previewToken
          })
        }
      }

      return this.$store.dispatch('storyblok/loadStory', {
        slug
      })
    }
  },
  async serverPrefetch () {
    const story = await this.fetchStory()

    const { id } = getStoryblokQuery(this.$route)

    if (this.$context && !id) {
      this.$context.output.cacheTags.add(`storyblok`)
    }

    return { story }
  },
  async mounted () {
    if (!this.story) {
      this.fetchStory()
    }

    if (this.previewToken) {
      const url = `https://app.storyblok.com/f/storyblok-latest.js?t=${this.previewToken}`

      await loadScript(url, 'storyblok-javascript-bridge')

      window['storyblok'].on(['input', 'published', 'change'], (event: any) => {
        if (event.action === 'input') {
          this.$store.commit('storyblok/updateStory', {story: event.story})
        } else if (!(event).slugChanged) {
          window.location.reload()
        }
      })
    }
  }
}
