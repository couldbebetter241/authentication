const Joi = require('@hapi/joi');

const uuidSchema = Joi.object({
    uuid: Joi.string().required().max(60),
})

module.exports = {
    uuidSchema,
}