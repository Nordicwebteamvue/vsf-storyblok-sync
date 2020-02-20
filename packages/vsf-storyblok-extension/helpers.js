export const index = 'storyblok_stories'

export function getHits (result) {
  if (result.body) { // differences between ES5 andd ES7
    return result.body.hits
  } else {
    return result.hits
  }
}

export function queryByPath (path) {
  return {
    index,
    type: 'story',
    body: {
      query: {
        constant_score: {
          filter: {
            term: {
              'full_slug.keyword': path
            }
          }
        }
      }
    }
  }
}

export const log = (string) => {
  console.log('📖 : ' + string) // eslint-disable-line no-console
}
