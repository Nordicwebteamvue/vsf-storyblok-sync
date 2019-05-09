function mapStoryToBulkAction ({ index, story: { id } }) {
  return {
    index: {
      _id: id,
      _index: index,
      _type: 'story'
    }
  }
}

function mapStoryToBulkDocument ({ id, ...story }) {
  return story
}

function indexStories ({ db, index, stories = [] }) {
  const bulkOps = stories.reduce((accumulator, story) => {
    accumulator.push(mapStoryToBulkAction({ index, story }))
    accumulator.push(mapStoryToBulkDocument(story))
    return accumulator
  }, [])

  return db.bulk({
    body: bulkOps
  })
}

async function syncStories ({ db, index, page = 1, perPage = 100, storyblokClient }) {
  const { data: { stories }, total } = await storyblokClient.get('cdn/stories', {
    page,
    per_page: perPage
  })

  const promise = indexStories({ db, index, stories })

  const lastPage = Math.ceil((total / perPage))

  if (page < lastPage) {
    page += 1
    return syncStories({ db, index, page, perPage, storyblokClient })
  }

  return promise
}

export { syncStories }
