const Joi = require('@hapi/joi')

const clientsSchema = Joi.object({
  name: Joi
    .string()
    .required(),
  email: Joi
    .string()
    .email({ minDomainSegments: 2 })
    .required()
}).unknown()

const wishlistSchema = Joi.object({
  productId: Joi
    .string()
    .required()
}).unknown()

module.exports = {
  clientsSchema,
  wishlistSchema
}
