import apicache from 'apicache'
import redis from 'redis'

let cacheFactory = config => apicache.options({ redisClient: redis.createClient(config.redis) }).middleware

export default cacheFactory
