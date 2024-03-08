const { Router } = require('express');
const postRouter = Router({ mergeParams: true });
const { getUserPosts, deleteUserPost, createPost, updatePost, getUserPost } = require('../controllers/post.controller');
const { createPostValidation, updatePostValidation, objectIdValidation } = require('../validators/post.validator')
const { validate } = require('express-validation');
const { authorization, isAuthenticate } = require('../middlewares/auth.middleware');
const passport = require('passport');
// require('../authentications/passport.authentication');
require('../middlewares/auth.middleware');


postRouter.get('/', validate(objectIdValidation), isAuthenticate, authorization(['admin', 'user']), getUserPosts);
postRouter.get('/:postId', validate(objectIdValidation), isAuthenticate, authorization(['admin', 'user']), getUserPost);
postRouter.delete('/:postId', validate(objectIdValidation), isAuthenticate, authorization(['admin', 'user']), deleteUserPost);
postRouter.put('/:postId', validate(updatePostValidation), isAuthenticate, authorization(['user']), updatePost);
postRouter.post('/', validate(createPostValidation), isAuthenticate, authorization(['user']), createPost);


exports.postRouter = postRouter;
