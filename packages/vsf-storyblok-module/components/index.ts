export const components = {
  debug: () => import('./Debug.vue'),
  page: () => import('./Page.vue'),
  grid: () => import('./Grid.vue'),
  tile: () => import('./Tile.vue')
}

export function registerComponent (key: string, component: any, options: any = {}) {
  if (components[key] && !options.replace) {
    console.log(`Component with key ${key} already exists, skipping...`)
    console.log('Use "{ replace: true }" as an option to replace the component')
    return
  }
  components[key] = component
}

export { default as Blok } from './Blok'
