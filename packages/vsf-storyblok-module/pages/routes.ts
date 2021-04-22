const StoryblokPage = () => import(/* webpackChunkName: "vsf-storyblok" */ './Storyblok.vue')
import { RouteConfig } from 'vue-router'

export const StoryblokRoutes: RouteConfig[] = [
  {
    name: 'storyblok',
    path: '/storyblok',
    component: StoryblokPage as any
  },
  {
    name: 'storyblok-single-component-visual-editor-mode',
    path: '/storyblok-empty',
    component: StoryblokPage as any,
    meta: { layout: 'empty' }
  }
]
