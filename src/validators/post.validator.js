const { Joi } = require('express-validation');

const params = Joi.object({
    userId: Joi.string().$.regex(/^[0-9a-fA-F]{24}$/).rule({ message: "Invalid UserId" }).required(),
    postId: Joi.string().$.regex(/^[0-9a-fA-F]{24}$/).rule({ message: "Invalid PostId" })
})

const schema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required()
}).alter({
    post: schema => schema.required(),
    put: schema => schema.fork(['title', 'body'], schema => schema.optional())
})


const createPostValidation = {
    body: schema.tailor('post')
}

const updatePostValidation = {
    body: schema.tailor('put'),
    params
}

const objectIdValidation = { params }

module.exports = { createPostValidation, updatePostValidation, objectIdValidation };   