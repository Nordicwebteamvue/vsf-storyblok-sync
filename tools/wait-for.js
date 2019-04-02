const fetch = require('cross-fetch')

const url = 'http://localhost:3000'
const timeout = 2500
const maxRetries = 100
let retries = -1

const waitFor = async () => {
  if (retries >= maxRetries) {
    throw new Error('Maximum number of retries reached')
  }
  retries += 1
  try {
    const result = await fetch(url)
    const text = await result.text()
    if (text.includes('Waiting for compilation...')) {
      console.log('🧱 : Server compiling') // eslint-disable-line no-console
      return setTimeout(() => {
        waitFor()
      }, timeout)
    }
  } catch (e) {
    console.log('🧱 : Server not reachable') // eslint-disable-line no-console
    return setTimeout(() => {
      waitFor()
    }, timeout)
  }
  if (retries > 0) {
    console.log('🧱 : ' + url + ' is ready. Exiting...') // eslint-disable-line no-console
  }
}

waitFor()
