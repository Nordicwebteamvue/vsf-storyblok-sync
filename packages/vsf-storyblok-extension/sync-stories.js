function mapStoryToBulkAction ({ index, story: { id } }) {
  return {
    index: {
      _id: id,
      _index: index,
      _type: 'story'
    }
  }
}

function indexStories ({ db, index, stories = [] }) {
  const bulkOps = stories.reduce((accumulator, story) => {
    accumulator.push(mapStoryToBulkAction({ index, story }))
    accumulator.push({
      ...story,
      content: JSON.stringify(story.content)
    })
    return accumulator
  }, [])

  return db.bulk({
    body: bulkOps
  })
}

async function syncStories ({ db, index, page = 1, perPage = 100, storyblokClient }) {
  const { data: { stories }, total } = await storyblokClient.get('cdn/stories', {
    page,
    per_page: perPage,
    resolve_links: 'url'
  })

  const newStories = stories.map(story => ({
    ...story,
    full_slug: story.full_slug.replace(/^\/|\/$/g, '')
  }))

  const promise = indexStories({ db, index, stories: newStories })

  const lastPage = Math.ceil((total / perPage))

  if (page < lastPage) {
    page += 1
    return syncStories({ db, index, page, perPage, storyblokClient })
  }

  return promise
}

export { syncStories }
