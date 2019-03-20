<!-- StoryBlok sync example Page -->
<template>
  <div>
    <div class="bg-cl-secondary py35 pl20">
      <div class="container">
        <breadcrumbs :routes="[{name: 'Homepage', route_link: '/'}]" :active-route="story.name" />
        <h2 class="fs-big"> {{ story.name }}</h2>
      </div>
    </div>

    <div class="container pt45 pb70">
      <div class="row pl20 pt0">
        <div class="static-content lh35">
          <div v-for="item in story.content.body" :key="item.uuid">
            <div v-if="item.component === 'feature'" style="border: 1px solid black">
              <markdown :input="item.body" />
            </div>
            <div v-else-if="item.component === 'something'">
              Render something here
            </div>
            <div v-else-if="item.component === 'something_else'">
              Render something_else here
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from 'theme/components/core/Breadcrumbs'
import StoryblokMixin from '../components/StoryblokMixin'
import Markdown from '../components/Markdown'
export default {
  name: 'StoryblokPage',
  mixins: [StoryblokMixin],
  components: {
    Breadcrumbs,
    Markdown
  }
}
</script>
