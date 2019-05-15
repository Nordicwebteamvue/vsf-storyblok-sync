import { add } from '@kodbruket/vsf-storyblok-module/components'

add('hero', () => import('./Hero.vue'))
add('demoImage', () => import('./Image.vue'))
// Overwrite an existing component
// add('tile', () => import('./Tile.vue'), { force: true })
add('newsletter', () => import('./Newsletter.vue'))
add('spacer', () => import('./Spacer.vue'))
add('textSection', () => import('./TextSection.vue'))
