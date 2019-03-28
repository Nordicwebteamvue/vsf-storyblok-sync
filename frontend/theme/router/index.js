const PageNotFound = () => import(/* webpackChunkName: "vsf-not-found" */ 'theme/pages/PageNotFound.vue')
const ErrorPage = () => import(/* webpackChunkName: "vsf-error" */ 'theme/pages/Error.vue')
const Storyblok = () => import(/* webpackChunkName: "vsf-sb-sync" */ 'theme/pages/Storyblok')

let routes = [
  { name: 'home', path: '/', component: Storyblok, alias: '/pwa.html' },
  { name: 'page-not-found', path: '/page-not-found', component: PageNotFound },
  { name: 'error', path: '/error', component: ErrorPage, meta: { layout: 'minimal' } },
  { name: 'storyblok', path: '/*', component: Storyblok }
]

export default routes
