export const components = {
  debug: () => import('./Debug.vue'),
  page: () => import('./Page.vue'),
  grid: () => import('./Grid.vue'),
  tile: () => import('./Tile.vue')
}

export function add (key: string, component: any, options: any = {}) {
  if (components[key] && !options.force) {
    console.log(`Component with key ${key} already exists, skipping...`)
    return
  }
  components[key] = component
}

export { default as Blok } from './Blok'
