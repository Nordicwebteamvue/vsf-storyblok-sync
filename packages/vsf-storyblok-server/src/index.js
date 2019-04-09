const express = require('express')
const cors = require('cors')
const Routes = require('@kodbruket/vsf-storyblok-extension')
const config = require('../config')

const app = express()
const port = config.server.port || 3030

app.use(cors())
const routes = Routes({
  config,
  db: {
    update (...args) {
      console.log(args)
    }
  }
})

app.use(routes)

app.listen(port, () => {
  console.log('VSF Storyblok API server started at port', port)
})
