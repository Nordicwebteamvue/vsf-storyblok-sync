const config = require('config')
const es = require('elasticsearch')
const esConfig = {
  host: config.elasticsearch.host + ':' + config.elasticsearch.port,
  // log: 'debug',
  apiVersion: config.elasticsearch.apiVersion,
  requestTimeout: 1000 * 60 * 60,
  keepAlive: false
}
if (config.elasticsearch.user) {
  esConfig.httpAuth = config.elasticsearch.user + ':' + config.elasticsearch.password
}
let client = new es.Client(esConfig)

export default callback => {
  callback(client)
}
