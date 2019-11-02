'use strict'

class ResponseParser {
  apiCollection(resource, items) {
    const output = {
      meta: {
        status: 200,
        message: `${resource} list`,
        total: items.total,
        perPage: items.perPage,
        page: items.page,
        lastPage: items.lastPage,
      },
      data: items.data,
    }
    return output
  }

  apiCreated(modelName, data) {
    const output = {
      meta: {
        status: 201,
        message: `${modelName} created successfully`,
      },
      data,
    }
    return output
  }

  apiUpdated(modelName, data) {
    const output = {
      meta: {
        status: 200,
        message: `${modelName} updated successfully`,
      },
      data,
    }
    return output
  }

  apiDeleted(modelName) {
    const output = {
      meta: {
        status: 200,
        message: `${modelName} deleted successfully`,
      },
    }
    return output
  }

  apiItem(modelName, data) {
    const output = {
      meta: {
        status: 200,
        message: `${modelName} detail`,
      },
      data,
    }
    return output
  }

  apiNotFound(modelName) {
    const meta = {
      status: 400,
      message: `${modelName} not found`,
    }
    return { meta }
  }

  apiValidationFailed(data) {
    const output = {
      meta: {
        status: 422,
        message: data[0].message,
      },
      details: data,
    }
    return output
  }

  /**
   * Error Response
   */

  errorResponse(msg) {
    return {
      meta: {
        status: 400,
        message: msg,
      },
    }
  }

  /**
   * Unauthorized
   */

  unauthorizedResponse() {
    return {
      meta: {
        status: 401,
        message: 'Unathorized',
      },
    }
  }

  /**
   * Success Response
   */

  successResponse(data, msg) {
    return {
      meta: {
        status: 200,
        message: msg,
      },
      data,
    }
  }

  /**
   * Forbidden Response
   */

  forbiddenResponse() {
    return {
      meta: {
        status: 403,
        message: 'Forbidden',
      },
    }
  }

  /**
   * Unknown Error Response
   */

  unknownError() {
    return {
      meta: {
        status: 500,
        message: 'Unknown Error',
      },
    }
  }
}

module.exports = new ResponseParser()
