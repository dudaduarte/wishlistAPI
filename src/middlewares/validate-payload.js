const { ApiError } = require('./error-handler')

const validatePayload = schema => (req, res, next) => {
  try {
    const validation = schema.validate(req.body)

    if (validation.error) {
      throw new ApiError(validation.error.details[0].message, 400)
    }

    return next()
  }

  catch (error) {
    return next(error)
  }
}

module.exports = validatePayload
