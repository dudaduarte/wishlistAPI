const jwt = require('jsonwebtoken')
const { ApiError } = require('./error-handler')

module.exports = async (req, res, next) => {
  const token = req.headers.authorization

  try {
    if (!token)
      throw new ApiError(
        'É necessário ter um token de autenticação para concluir essa request.',
        401
      )

    if (token.split('.').length !== 3)
      throw new ApiError('O token informado é inválido.', 401)

    jwt.verify(token, process.env.SECRET)

    return next()
  }

  catch (error) {
    if (error.message === 'invalid token')
      return next(new ApiError('O token informado é inválido.', 401))

    if (error.message === 'jwt expired')
      return next(new ApiError('O token informado expirou.', 401))

    return next(error)
  }
}
