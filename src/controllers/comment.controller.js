const { getSuccessResponse } = require('../utils/response.util');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const createError = require('http-errors');
const { fieldsToSend } = require('../helpers/filteredData.helper');

exports.createComment = async (req, res, next) => {
    try {
        const { userId, postId } = req.params;
        const postExists = await Post.exists({ _id: postId, user: userId, isDelete: false });
        if (!postExists) throw createError(404, 'post does not exists');
        const comment = await Comment.create({
            user: req.user._id.toString(),
            post: postId,
            comment: req.body.comment
        });
        const fields = ['_id','comment', 'user', 'post'];
        const filteredData = fieldsToSend(comment, fields);
        return res.status(201).json(getSuccessResponse('Comment Created Succefully', filteredData));
    } catch (error) {
        next(error);
    }
}

exports.updateComment = async (req, res, next) => {
    try {
        const { commentId, userId, postId } = req.params;
        if (userId !== req.user._id.toString()) throw createError(403, 'permission denied');
        const updatedComment = await Comment.findByIdAndUpdate(
            { _id: commentId, user: userId, post: postId, isDelete: false },
            { $set: { comment: req.body.comment } },
            { new: true }
        );
        if (updatedComment.modifiedCount === 0) throw createError(404, 'comment does not exists');
        const fields = ['_id','comment', 'user', 'post'];
        const filteredData = fieldsToSend(updatedComment, fields);
        return res.json(getSuccessResponse('Comment Updated Successfully', filteredData));
    } catch (error) {
        next(createError(404, 'comment does not exists'));
    }
}

exports.deleteComment = async (req, res, next) => {
    try {
        const { commentId, userId, postId } = req.params;
        const post = await Post.findOne({ _id: postId, isDelete: false }).lean();
        const comment = await Comment.findOne({ _id: commentId, user: userId, post: postId, isDelete: false }).lean();
        if(!comment) throw createError(404,'comment does not exists');
        if(req.user._id.toString() === comment.user.toString() || post.user.toString() === req.user._id.toString()) {
            await Comment.updateOne({ _id: commentId }, { $set: { isDelete: true } });
            return res.json(getSuccessResponse('Comment Deleted Successfully'));
        } else {
            throw createError(403, 'Access Denied');
        }
    } catch (error) {
        next(error);
    }
}

exports.getPostComments = async (req, res, next) => {
    try {
        const { userId, postId } = req.params;
        let { limit = 10, pageNo = 1 } = req.query;
        const skipRecordsCount = pageNo ? limit * (pageNo - 1) : 0;
        const comments = await Comment.find({ user: userId, post: postId, isDelete: false }, { comment: 1, user: 1, post: 1 }).lean().skip(skipRecordsCount).limit(limit);
        if (!comments.length && limit >= 1 && pageNo > 1) throw next(createError(404, 'page not found'));

        return res.json(getSuccessResponse('comments fetched successfully', comments));
    } catch (error) {
        next(createError(404, 'comments does not exists'));
    }
}

exports.getPostComment = async (req, res, next) => {
    try {
        const { userId, postId, commentId } = req.params;
        const comments = await Comment.findOne({ _id: commentId, user: userId, post: postId, isDelete: false }).lean();
        if (!comments) throw createError(404, 'comment does not exists');
        const fields = ['_id','comment', 'user', 'post'];
        const filteredData = fieldsToSend(comments, fields);
        return res.json(getSuccessResponse('comments fetched successfully', filteredData));
    } catch (error) {
        next(createError(404, 'comment does not exists'));
    }
}


