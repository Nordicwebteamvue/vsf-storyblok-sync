import { add } from 'src/modules/vsf-storyblok-module/components'

add('hero', () => import('./Hero.vue'))
add('Image', () => import('./Image.vue'))
add('RichText', () => import('./RichText.vue'))
add('Collage', () => import('./Collage.vue'))
add('ciLink', () => import('./Link.vue'))
// Overwrite an existing component
// add('tile', () => import('./Tile.vue'), { force: true })
