class ApiError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

const errorHandler = (error, res) => {
  const statusCode = error.statusCode || 500
  const message = error.message || 'Houve um erro ao processar a requisição.'

  return res.status(statusCode).json({
    error: {
      statusCode,
      message
    }
  })
}

module.exports = {
  ApiError,
  errorHandler
}
