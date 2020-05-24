const router = require('express').Router()
const wishlistController = require('../../controllers/clients/wishlist')
const validateAuthToken = require('../../middlewares/auth')
const validatePayload = require('../../middlewares/validate-payload')
const { wishlistSchema } = require('../../schemas/clients')

router.get(
  '/',
  validateAuthToken,
  wishlistController.getWishlist
)
router.get(
  '/:productId',
  validateAuthToken,
  wishlistController.getWishlistProduct
)
router.post(
  '/',
  validatePayload(wishlistSchema),
  validateAuthToken,
  wishlistController.postWishlistProduct
)
router.delete(
  '/:productId',
  validateAuthToken,
  wishlistController.deleteWishlistProduct
)

module.exports = router
