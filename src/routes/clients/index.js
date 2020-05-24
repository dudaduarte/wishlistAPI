const router = require('express').Router()
const clientsController = require('../../controllers/clients')
const validateAuthToken = require('../../middlewares/auth')
const validatePayload = require('../../middlewares/validate-payload')
const { clientsSchema } = require('../../schemas/clients')
const wishlistRoutes = require('./wishlist')

router.get(
  '/',
  validateAuthToken,
  clientsController.getClients
)
router.post(
  '/',
  validatePayload(clientsSchema),
  validateAuthToken,
  clientsController.postClients
)
router.get(
  '/:id',
  validateAuthToken,
  clientsController.getClientById
)
router.delete(
  '/:id',
  validateAuthToken,
  clientsController.deleteClients
)
router.put(
  '/:id',
  validatePayload(clientsSchema),
  validateAuthToken,
  clientsController.putClients
)

router.use('/:id/wishlist', (req, res, next) => {
  req.id = req.params.id
  return next()
}, wishlistRoutes)

module.exports = router
