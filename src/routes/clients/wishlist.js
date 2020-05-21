const router = require('express').Router()
const wishlistController = require('../../controllers/clients/wishlist')

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
  wishlistController.postWishlistProduct
)
router.delete(
  '/:productId',
  wishlistController.deleteWishlistProduct
)

module.exports = router
