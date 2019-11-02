'use strict'

const ResponseParser = require('./ResponseParser')
const Cache = require('./Cache')
const Audit = require('./Audit')
const ErrorLog = require('./ErrorLog')

class DataLoader {
  async getPaginated(
    { request, response },
    modelName,
    searchable = [],
    wheres = []
  ) {
    try {
      const {
        page,
        limit,
        search,
        sortBy,
        sortMode,
        redisKey,
      } = this.parsePaginationData(request, wheres)

      const cache = await Cache.get(modelName, redisKey)
      if (cache) {
        console.log(`${modelName} from cache`)
        return cache
      }

      const Model = this.getModel(modelName)
      const data = await Model.query()
        .where(function() {
          if (searchable.length > 0 && search && search !== '') {
            this.where(searchable.shift(), 'like', `%${search}%`)
            searchable.map(s => {
              this.orWhere(s, 'like', `%${search}%`)
            })
          }

          if (wheres.length > 0) {
            wheres.map(w => this.where(w))
          }
        })
        .orderBy(sortBy, sortMode)
        .paginate(page, limit)

      const parsed = ResponseParser.apiCollection(modelName, data.toJSON())

      if (!search) {
        await Cache.put(modelName, redisKey, parsed)
      }

      return response.status(200).send(parsed)
    } catch (e) {
      console.log('e', e)
      ErrorLog(request, e)
      return response.status(500).send(ResponseParser.unknownError())
    }
  }

  async getDataById(modelName, id, customField, wheres = []) {
    let data = null
    const Model = this.getModel(modelName)
    if (customField.length) {
      data = await Model.query()
        .where(function(builder) {
          if (customField.length > 0) {
            builder.where(customField.shift(), id)
            customField.map(field => {
              builder.orWhere(field, id)
            })
          }
          if (wheres.length > 0) {
            wheres.map(w => this.where(w))
          }
        })
        .first()
    } else {
      data = await Model.find(id)
    }
    return data
  }

  async getById(
    { request, response },
    modelName,
    relations = [],
    customField = [],
    wheres = []
  ) {
    try {
      const id = request.params.id

      let whereToString = ''
      if (wheres.length > 0) {
        whereToString += wheres.map(w => Object.values(w).join('_'))
      }

      const redisKey = `${modelName}_${id}_${whereToString}`
      const cache = await Cache.get(modelName, redisKey)
      if (cache) {
        console.log(`${modelName} detail from cache`)
        return cache
      }

      const data = await this.getDataById(modelName, id, customField, wheres)

      if (!data) {
        return response.status(400).send(ResponseParser.apiNotFound(modelName))
      }

      if (relations.length > 0) {
        for (let i = 0; i < relations.length; i++) {
          await data.load(relations[i])
        }
      }

      const parsed = ResponseParser.apiItem(modelName, data.toJSON())
      await Cache.put(modelName, redisKey, parsed)

      return response.status(200).send(parsed)
    } catch (e) {
      console.log('e', e)
      ErrorLog(request, e)
      return response.status(500).send(ResponseParser.unknownError())
    }
  }

  async store(ctx, modelName, fillable, relations = []) {
    const { request, response } = ctx
    try {
      const body = request.only(fillable)
      const Model = this.getModel(modelName)

      const data = await Model.create(body)

      // Load relations if required
      if (relations.length > 0) {
        for (let i = 0; i < relations.length; i++) {
          await data.load(relations[i])
        }
      }

      Audit(ctx, 0, data.id, modelName, JSON.stringify(data.toJSON()))
      await Cache.remove(modelName)

      return response
        .status(201)
        .send(ResponseParser.apiCreated(modelName, data.toJSON()))
    } catch (e) {
      console.log('e', e)
      ErrorLog(request, e)
      return response.status(500).send(ResponseParser.unknownError())
    }
  }

  async update(ctx, modelName, fillable, customField = [], relations = []) {
    const { request, response } = ctx
    try {
      const id = request.params.id
      let oldData
      const data = await this.getDataById(modelName, id, customField)

      if (!data) {
        return response.status(400).send(ResponseParser.apiNotFound(modelName))
      }

      oldData = data.toJSON()
      const body = request.only(fillable)
      data.merge(body)
      await data.save()

      // Load relations if required
      if (relations.length > 0) {
        for (let i = 0; i < relations.length; i++) {
          await data.load(relations[i])
        }
      }

      const parsed = ResponseParser.apiUpdated(modelName, data.toJSON())
      const auditDetail = {
        oldData,
        newData: data.toJSON(),
      }
      Promise.all([
        Cache.remove(modelName),
        Audit(ctx, 1, data.id, modelName, JSON.stringify(auditDetail)),
      ])

      return response.status(200).send(parsed)
    } catch (e) {
      console.log('e', e)
      ErrorLog(request, e)
      return response.status(500).send(ResponseParser.unknownError())
    }
  }

  async delete(ctx, modelName, dbObject = null, customField = []) {
    const { request, response } = ctx
    try {
      let data = null
      data = dbObject
      if (!dbObject) {
        const id = request.params.id
        data = await this.getDataById(modelName, id, customField)

        if (!data) {
          return response
            .status(400)
            .send(ResponseParser.apiNotFound(modelName))
        }
      }

      await data.delete({ force: true })
      Promise.all([
        Cache.remove(modelName),
        Audit(ctx, 2, data.id, modelName, JSON.stringify(data)),
      ])

      return response.status(200).send(ResponseParser.apiDeleted(modelName))
    } catch (e) {
      console.log('e', e)
      ErrorLog(request, e)
      return response.status(500).send(ResponseParser.unknownError())
    }
  }

  parsePaginationData(request, wheres) {
    const query = request.get()
    let whereToString = ''
    if (wheres.length > 0) {
      whereToString += wheres.map(w => Object.values(w).join('_'))
    }
    const output = {
      page: query.page || 1,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'created_at',
      sortMode: query.sortMode || 'desc',
      search: query.search,
    }

    const redisKey = Object.values(output).join('_') + whereToString
    output.redisKey = redisKey
    return output
  }

  getModel(modelName) {
    const Model = use(`App/Models/${modelName}`)
    return Model
  }
}

module.exports = new DataLoader()
