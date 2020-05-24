const Joi = require('@hapi/joi')

const adminSchema = Joi.object({
  name: Joi
    .string()
    .required(),
  email: Joi
    .string()
    .email({ minDomainSegments: 2 })
    .required(),
  password: Joi
    .string()
    .min(4)
    .max(15)
    .required()
}).unknown()

const authSchema = Joi.object({
  email: Joi
    .string()
    .email({ minDomainSegments: 2 })
    .required(),
  password: Joi
    .string()
    .required()
}).unknown()

module.exports = {
  adminSchema,
  authSchema
}
