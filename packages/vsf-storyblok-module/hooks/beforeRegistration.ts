import qs from 'qs'

const loadScript = (src, id)  => new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
    resolve();
    return
  }
  var script = document.createElement('script')
  script.async = true
  script.src = src
  script.id = id
  script.onerror = function() {
    reject(new Error('Failed to load' + src))
  }
  script.onload = function() {
    resolve()
  }
  document.getElementsByTagName('head')[0].appendChild(script)
})

export function beforeRegistration ({ Vue, config, store, isServer }) {
  if (!isServer) {
    const url = `https://app.storyblok.com/f/storyblok-latest.js?t=${config.storyblok.accessToken}`
    loadScript(url, 'storyblok-javascript-bridge').then(() => {
      window['storyblok'].on(['input', 'published', 'change'], (event) => {
        if (event.action == 'input') {
          store.commit('storyblok/update', {story: event.story})
        } else if (!event.slugChanged) {
          window.location.reload()
        }
      })
    })
  }
  Vue.directive('editable', {
    bind: function(el, binding) {
      if (typeof binding.value._editable === 'undefined') {
        return
      }
      var options = JSON.parse(binding.value._editable.replace('<!--#storyblok#', '').replace('-->', ''))
      el.setAttribute('data-blok-c', JSON.stringify(options))
      el.setAttribute('data-blok-uid', options.id + '-' + options.uid)
      el.classList.add('storyblok__outline')
    }
  })
}
