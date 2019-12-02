/* eslint-disable no-console */
const {createFileList, copy, prefix, getDest} = require('./helpers')
const fs = require('fs-extra')
const path = require('path')
const program = require('commander')
const merge = require('deepmerge')

program
  .option('-e, --environment <env>', 'which config to build')

program.parse(process.argv)

const services = createFileList()
services.forEach(service => {
  console.log('🗑️  Removing old files for service ' + service.id + '...')
  fs.removeSync(path.resolve(process.cwd(), prefix, service.bundle))
})
services.forEach(service => {
  // copy context if any
  if (service.context) {
    console.log('📂  Copying context for service ' + service.id + '...')
    copy(service.context, service.bundle)
  }
  service.volumes.map(volume => {
    const [src, dest] = volume.split(':')
    copy(src, dest, service.bundle)
  })
  const { environment } = program
  if (environment === 'production' || environment === 'staging') {
    const baseConfigVolume = service.volumes.find(volume => volume.includes('base.json'))
    if (baseConfigVolume) {
      let [baseConfig, configTarget] = baseConfigVolume.split(':')
      configTarget = getDest(configTarget, service.bundle)
      const mergeConfig = baseConfig.replace('base.json', `${environment}.json`)
      if (fs.existsSync(mergeConfig)) {
        const baseFile = fs.readFileSync(baseConfig, 'utf8')
        const mergeFile = fs.readFileSync(mergeConfig, 'utf8')
        const newFile = merge(JSON.parse(baseFile), JSON.parse(mergeFile))
        fs.writeFileSync(configTarget, JSON.stringify(newFile, null, 2))
      }
    }
  }
})
