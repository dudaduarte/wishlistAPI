const router = require('express').Router()
const clientsController = require('../../controllers/clients')
const wishlistRoutes = require('./wishlist')

router.get(
  '/',
  clientsController.getClients
)
router.post(
  '/',
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
  clientsController.putClients
)

router.use('/:id/wishlist', (req, res, next) => {
  req.id = req.params.id
  return next()
}, wishlistRoutes)

module.exports = router