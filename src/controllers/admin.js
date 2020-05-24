const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../database/models')
const { ApiError } = require('../middlewares/error-handler')

const searchUserByEmail = email => db.AdminUsers
  .findOne({ where: { email } })

const createToken = params => jwt.sign(params, process.env.SECRET, {
  expiresIn: 10800
})

exports.adminPost = async (req, res, next) => {
  try {
    const { body } = req
    const encryptedPassword = await bcrypt.hash(body.password, 10)

    delete body.password
    body.encryptedPassword = encryptedPassword

    const user = await db.AdminUsers.create(body)

    delete user.dataValues.encryptedPassword
    
    return res.status(201).send({
      ...user.dataValues,
      token: createToken({ id: user.id })
    })
  }

  catch (error) {
    if (error.message === 'Validation error')
      return next(new ApiError('Já existe cadastro vinculado ao email informado.', 409))

    return next(error)
  }
}

exports.authPost = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await searchUserByEmail(email)

    if (!user)
      throw new ApiError('Usuário admin não encontrado.', 404)

    if (!await bcrypt.compare(password, user.encryptedPassword))
      throw new ApiError('A senha informada está incorreta.', 400)

    delete user.dataValues.encryptedPassword

    return res.status(200).send({ token: createToken({ id: user.id }) })
  }

  catch (error) {
    return next(error)
  }
}
