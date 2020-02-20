import { apiStatus } from '../../../../lib/util'

const protectRoute = (config) => (req, res, next) => {
  if (process.env.VS_ENV !== 'dev') {
    if (!req.query.secret) {
      return apiStatus(res, {
        error: 'Missing query param: secret'
      }, 403)
    }
    if (req.query.secret !== config.storyblok.hookSecret) {
      return apiStatus(res, {
        error: 'Invalid secret'
      }, 403)
    }
  }
  next()
}

export default protectRoute
