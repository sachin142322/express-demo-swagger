const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title : {
        type:String
    },
    body: {
        type:String
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
},{timestamps:true});

const Post = mongoose.model('post',postSchema);

module.exports = Post;