const db = require('../../database/models')
const { ApiError } = require('../../middlewares/error-handler')
const sequelize = db.sequelize

exports.getClients = async (req, res) => {
  let clients

  if (req.query.name) {
    clients = await db.Clients.findAll({ where: { name: req.query.name } })
    
    return res.status(200).send(clients)
  }

  clients = await db.Clients.findAll()

  return res.status(200).send(clients)
}

exports.getClientById = async (req, res, next) => {
  try {
    const client = await db.Clients.findByPk(req.params.id)
  
    if (!client)
      throw new ApiError('O cliente informado não existe.', 404)

    return res.status(200).send(client)
  }

  catch (error) {
    return next(error)
  }
}

exports.postClients = async (req, res, next) => {
  const { body } = req

  try {
    const createdClient = await sequelize.transaction(async trx => {
      const client = await db.Clients.create(
        { name: body.name, email: body.email },
        { transaction: trx }
      )
  
      await db.Wishlists.create(
        { clientId: client.id },
        { transaction: trx }
      )
  
      return client
    })

    return res.status(201).send(createdClient)
  }

  catch (error) {
    if (error.message === 'Validation error')
      return next(new ApiError('Já existe cadastro vinculado ao email informado.', 409))

    return next(error)
  }
}

exports.putClients = async (req, res, next) => {
  try {
    const client = await db.Clients.findByPk(req.params.id)

    if (!client)
      throw new ApiError('O cliente informado não existe.', 404)

    await client.update(req.body)

    return res.status(200).send(client)
  }

  catch (error) {
    if (error.message === 'Validation error')
      return next(new ApiError('Já existe cadastro vinculado ao email informado.', 409))

    return next(error)
  }
}

exports.deleteClients = async (req, res, next) => {
  try {
    const client = await db.Clients.findOne({
      where: { id: req.params.id }
    })

    if (!client)
      throw new ApiError('O cliente informado não existe.', 404)

    await sequelize.transaction(async trx => {
      await db.Wishlists.destroy({
        where: { clientId: client.id },
        transaction: trx
      })

      return client.destroy({ transaction: trx })
    })
  
    return res.status(200).send(client)
  }

  catch (error) {
    return next(error)
  }
}
