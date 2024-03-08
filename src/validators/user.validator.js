const createError = require('http-errors');
const { Joi } = require('express-validation');

const params = Joi.object({
    userId: Joi.string().$.regex(/^[0-9a-fA-F]{24}$/).rule({ message: "invalid UserId" })
})

const query = Joi.object({
    pageNo: Joi.number().integer().message('Invalid query parameter'),
    limit: Joi.number().integer().min(1).max(100).message('Invalid query parameter')
})

const schema = Joi.object({
    name: Joi.string().min(3).required(),
    userName: Joi.string().alphanum().min(5).required(),
    email: Joi.string().email().required(),
    password:Joi.string().required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Password and confirm password do not match'
    })
}).alter({
    post: schema => schema.required(),
    put: schema => schema.fork(['name', 'email', 'userName','password','confirm_password'], schema => schema.optional())
})


const createUserValidation = {
    body: schema.tailor('post')
}

const updateUserValidation = {
    body: schema.tailor('put'),
    params
}

const otherValidation = { params,query }


module.exports = { createUserValidation, updateUserValidation, otherValidation };   