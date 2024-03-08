const { fieldsToSend } = require('../helpers/filteredData.helper');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const { getSuccessResponse } = require('../utils/response.util')
const createError = require('http-errors');

exports.getUserPosts = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        let { limit = 10, pageNo = 1 } = req.query;
        const skipRecordsCount = pageNo ? limit * (pageNo - 1) : 0;

        const userPosts = await Post.find({ user: userId, isDelete: false }, { title: 1, body: 1 }).lean().skip(skipRecordsCount).limit(limit);
        if (!userPosts.length && limit >= 1 && pageNo > 1) throw createError(404, 'page not found');

        return res.status(200).json(getSuccessResponse('posts fetched successfully', userPosts));
    } catch (error) {
        next(error);
    }
}

exports.getUserPost = async (req, res, next) => {
    try {
        const { userId, postId } = req.params;
        const post = await Post.findOne({ _id: postId, user: userId, isDelete: false }).lean();
        if (!post) throw createError(404, 'post does not exists');
        const fields = ['_id','title', 'body'];
        const filteredData = fieldsToSend(post, fields);
        return res.status(200).json(getSuccessResponse('post fetched successfully', filteredData));
    } catch (error) {
        next(error);
    }
}

exports.deleteUserPost = async (req, res, next) => {
    try {
        const { userId, postId } = req.params;
        if (userId !== req.user._id.toString()) throw createError(403, 'permission denied');

        const post = await Post.findOne({ _id: postId, user: userId, isDelete: false });
        if (post) {
            await Promise.all([
                Post.findOneAndUpdate({ _id: postId, user: userId }, { $set: { isDelete: true } }),
                Comment.updateMany({ post: postId }, { $set: { isDelete: true } })
            ])
        }
        else {
            throw createError(404, 'post does not exists');
        }
        return res.status(200).json(getSuccessResponse('post deleted successfully'));
    } catch (error) {
        next(error);
    }
}

exports.createPost = async (req, res, next) => {
    try {
        const { title, body } = req.body;
        const { userId } = req.params;
        if (userId !== req.user._id.toString()) throw createError(403, 'permission denied');
        const userExists = await User.exists({ _id: userId });
        if (!userExists) throw createError(404, 'user does not exists');
        const post = await Post.create({
            user: req.params.userId,
            title,
            body
        });
        const fields = ['title', 'body'];
        const filteredData = fieldsToSend(post, fields);
        return res.status(201).json(getSuccessResponse('Post Created Succefully', filteredData));
    } catch (error) {
        next(error);
    }
}


exports.updatePost = async (req, res, next) => {
    try {
        const { userId, postId } = req.params;
        if (userId !== req.user._id.toString()) throw createError(403, 'permission denied');
        const { title, body } = req.body;
        const updatedPostData = await Post.findOneAndUpdate(
            { _id: postId, user: userId, isDelete: false },
            { $set: { title, body } },
            { new: true }
        );
        const fields = ['_id','title', 'body'];
        const filteredData = fieldsToSend(updatedPostData, fields);
        if (!updatedPostData) throw createError(404, 'post does not exists');
        return res.status(200).json(getSuccessResponse('Post Updated Successfully', filteredData));
    } catch (error) {
        next(error);
    }
}


