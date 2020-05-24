const router = require('express').Router()
const controller = require('../controllers/admin')
const validatePayload = require('../middlewares/validate-payload')
const { adminSchema, authSchema } = require('../schemas/admin')

// Admin
router.post(
  '/',
  validatePayload(adminSchema),
  controller.adminPost
)

// Authenticate Admin User
router.post(
  '/authenticate',
  validatePayload(authSchema),
  controller.authPost
)

module.exports = router
