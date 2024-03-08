const { Joi } = require('express-validation');

const params = Joi.object({
    userId: Joi.string().$.regex(/^[0-9a-fA-F]{24}$/).rule({ message: "Invalid UserId" }).required(),
    postId: Joi.string().$.regex(/^[0-9a-fA-F]{24}$/).rule({ message: "Invalid PostId" }).required(),
    commentId: Joi.string().$.regex(/^[0-9a-fA-F]{24}$/).rule({ message: "Invalid CommentId" })
})


const schema = Joi.object({
    comment: Joi.string().required()
}).alter({
    post: schema => schema.required(),
    put: schema => schema.fork(['comment'], schema => schema.optional())
})


const createCommentValidation = {
    body: schema.tailor('post')
}

const updateCommentValidation = {
    body: schema.tailor('put'),
    params
}

const objectIdValidation = { params }

module.exports = { createCommentValidation, updateCommentValidation, objectIdValidation };   