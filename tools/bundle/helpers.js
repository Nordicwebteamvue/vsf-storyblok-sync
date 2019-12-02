/* eslint-disable no-console */
const yaml = require('js-yaml')
const path = require('path')
const get = require('lodash.get')
const fs = require('fs-extra')

const prefix = './.output/'

const getSrc = _src => path.resolve(process.cwd(), './', _src)
const getDest = (_dest, service) => path.resolve(process.cwd(), prefix, _dest.replace('/var/www', service))

function copy (_src, _dest, service = '') {
  const src = getSrc(_src)
  const dest = getDest(_dest, service)
  console.log(`📂  Copying ${path.basename(src)} to ${dest}`)
  fs.copySync(src, dest, {
    filter: (_path) => !_path.includes('node_modules')
  })
}

function createFileList () {
  const defaultConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, 'default.yml'), 'utf8'))
  const userConfig = {}
  const config = {...defaultConfig, ...userConfig}
  const files = [...get(config, 'files', [])]
  console.log('🗒️  Creating config from the following files:\n🗒️ ', files.join('\n🗒️  '))

  const services = {}
  files.filter(Boolean).forEach(file => {
    var doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'))
    Object.entries(doc.services).map(([id, object]) => {
      if (services[id]) {
        services[id].bundle = get(object, 'labels.bundle', services[id].bundle)
        services[id].context = get(object, 'build.context', services[id].context)
        services[id].volumes = [...services[id].volumes, ...get(object, 'volumes', [])]
        services[id].volumesLast = [...services[id].volumesLast, ...get(object, 'volumesLast', [])]
      } else {
        services[id] = {
          bundle: get(object, 'labels.bundle'),
          context: get(object, 'build.context'),
          volumes: get(object, 'volumes', []),
          volumesLast: get(object, 'volumesLast', [])
        }
      }
    })
  })
  const array = Object.entries(services)
    .map(([id, object]) => ({id, ...object}))
    .filter(service => service.bundle)
  return array.map(service => ({
    ...service,
    volumes: [...service.volumes, ...service.volumesLast]
  }))
}

module.exports = {
  createFileList,
  copy,
  prefix,
  getSrc,
  getDest
}
