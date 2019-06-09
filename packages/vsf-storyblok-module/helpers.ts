import qs from 'qs'

export function loadScript (src, id) {
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

export function getStoryblokQueryParams (route) {
  const queryString = route.fullPath.replace(route.path, '')
  const { _storyblok: id, _storyblok_c: c, _storyblok_tk: storyblok = {} } = qs.parse(queryString, { ignoreQueryPrefix: true })
  const { space_id: spaceId, timestamp, token } = storyblok

  let [_, ...fullSlug] = route.path

  if (!fullSlug) {
    fullSlug = "home"
  }

  return {
    c,
    id,
    fullSlug,
    spaceId,
    timestamp,
    token
  }
}
