const router = require('express').Router()
const wishlistController = require('../../controllers/clients/wishlist')
const validatePayload = require('../../middlewares/validate-payload')
const { wishlistSchema } = require('../../schemas/clients')

router.get(
  '/',
  wishlistController.getWishlist
)
router.get(
  '/:productId',
  wishlistController.getWishlistProduct
)
router.post(
  '/',
  validatePayload(wishlistSchema),
  wishlistController.postWishlistProduct
)
router.delete(
  '/:productId',
  wishlistController.deleteWishlistProduct
)

module.exports = router
