'use strict'

const Cache = use('Cache')

class CacheHelper {
  async get(tag, key) {
    return await Cache.tags([tag]).get(key)
  }
  async put(tag, key, data, expiresIn = 60 * 4) {
    return await Cache.tags([tag]).put(key, data, expiresIn)
  }
  async remove(tag) {
    return await Cache.tags([tag]).flush()
  }

  async flush() {
    return await Cache.flush()
  }
}

module.exports = new CacheHelper()
