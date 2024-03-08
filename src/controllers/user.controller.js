const { getSuccessResponse } = require('../utils/response.util');
const createError = require('http-errors');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const { fieldsToSend } = require('../helpers/filteredData.helper');

exports.createUser = async (req, res, next) => {
    try {
        const { name, email, userName, password } = req.body;

        const isEmailExists = await User.exists({ email });
        if (isEmailExists) throw createError(409, 'email already exists');

        const isUserNameExists = await User.exists({ userName });
        if (isUserNameExists) throw createError(409, 'userName already exists');

        const user = await User.create({
            name,
            email,
            userName,
            password
        });
        const fields = ['name', 'email', 'userName', 'role'];
        const filteredData = fieldsToSend(user, fields);
        return res.status(201).json(getSuccessResponse('User Created Succefully', filteredData));
    } catch (error) {
        next(error);
    }
}

exports.getUsers = async (req, res, next) => {
    try {
        let { limit = 10, pageNo = 1 } = req.query;

        const skipRecordsCount = pageNo > 0 ? limit * (pageNo - 1) : 0;
        const users = await User.find({ isDelete: false }, { password:0 }).lean().skip(skipRecordsCount).limit(limit);
        if (!users.length && limit >= 1 && pageNo >= 1) throw createError(404, 'page not found');
        return res.status(200).json(getSuccessResponse('users fetched successfully', users));
    } catch (error) {
        next(error);
    }
}

exports.getUserById = async (req, res, next) => {
    try {
        const _id = req.params.userId;
        const user = await User.findOne({ _id, isDelete: false });
        if (!user) throw createError.NotFound()
        const fields = ['name', 'email', 'userName', 'role'];
        const filteredData = fieldsToSend(user, fields);
        return res.status(200).json(getSuccessResponse('user fetched successfully', user.toObject()));
    } catch (error) {
        next(error);
    }
}

/**
 * delete user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (userId !== req.user._id.toString()) throw createError(403, 'permission denied');

        const user = await User.findOne({ _id: userId, isDelete: false });
        if (!user) throw createError(404, 'user does not exists');

        const posts = await Post.find({ user: userId, isDelete: false });
        const postIds = posts.map((d) => d._id);

        await Promise.all([
            User.findByIdAndUpdate({ _id: userId }, { $set: { isDelete: true } }),
            Post.updateMany({ user: userId }, { $set: { isDelete: true } }),
            Comment.updateMany({ user: userId }, { $set: { isDelete: true } }),
            postIds.map(postId => Comment.updateMany({ post: postId }, { $set: { isDelete: true } }))
        ]);
        return res.status(200).json(getSuccessResponse('user deleted successfully'));

    } catch (error) {
        next(error);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const _id = req.params.userId;
        const { name, email, userName } = req.body;

        if (_id !== req.user._id.toString()) throw createError(403, 'permission denied');
        const isEmailExists = await User.exists({ email, isDelete: false });
        if (isEmailExists) throw createError(409, 'email already exists');

        const isUserNameExists = await User.exists({ userName, isDelete: false });
        if (isUserNameExists) throw createError(409, 'userName already exists');

        const updatedUserData = await User.findByIdAndUpdate(
            _id,
            { $set: { name, email, userName } },
            { new: true }
        ).select('-password');
        const fields = ['name', 'email', 'userName', 'role'];
        const filteredData = fieldsToSend(updatedUserData, fields);
        if (!updatedUserData) throw createError(404, 'user does not exists');
        return res.status(200).json(getSuccessResponse('User Updated Successfully', filteredData));
    } catch (error) {
        next(error);
    }
}

