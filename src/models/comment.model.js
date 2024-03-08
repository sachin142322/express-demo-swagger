const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('../models/user.model');
const Post = require('../models/post.model');


const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },
    comment: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// commentSchema.pre(['save'], async function (next) {
//     try {
//         const userExists = await User.findOne({ _id: this.user });
//         const postExists = await Post.findOne({ _id: this.post });
//         if (!userExists || !postExists) throw new Error('user/post does not found');
//         next();
//     } catch (error) {
//         next.status = 404;
//         next(error)
//     }
// })


const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;