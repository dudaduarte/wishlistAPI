const router = require('express').Router()
const clientsController = require('../../controllers/clients')
const validatePayload = require('../../middlewares/validate-payload')
const { clientsSchema } = require('../../schemas/clients')
const wishlistRoutes = require('./wishlist')

router.get(
  '/',
  clientsController.getClients
)
router.post(
  '/',
  validatePayload(clientsSchema),
  clientsController.postClients
)
router.get(
  '/:id',
  clientsController.getClientById
)
router.delete(
  '/:id',
  clientsController.deleteClients
)
router.put(
  '/:id',
  validatePayload(clientsSchema),
  clientsController.putClients
)

router.use('/:id/wishlist', (req, res, next) => {
  req.id = req.params.id
  return next()
}, wishlistRoutes)

module.exports = router
