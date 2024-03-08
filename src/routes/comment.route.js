const { Router } = require('express');
const commentRouter = Router({ mergeParams: true });
const { updateComment, getPostComments, getPostComment, deleteComment, createComment } = require('../controllers/comment.controller');
const { createCommentValidation, updateCommentValidation, objectIdValidation } = require('../validators/comment.validator');
const { validate } = require('express-validation');
const { authorization, isAuthenticate } = require('../middlewares/auth.middleware');
const passport = require('passport');
require('../middlewares/auth.middleware');

commentRouter.get('/', validate(objectIdValidation), isAuthenticate, authorization(['admin', 'user']), getPostComments);
commentRouter.get('/:commentId', validate(objectIdValidation), isAuthenticate, authorization(['admin', 'user']), getPostComment);
commentRouter.delete('/:commentId', validate(objectIdValidation), isAuthenticate, authorization(['admin', 'user']), deleteComment);
commentRouter.post('/', validate(createCommentValidation), isAuthenticate, authorization(['admin', 'user']), createComment);
commentRouter.put('/:commentId', validate(updateCommentValidation), isAuthenticate, authorization(['user']), updateComment);


exports.commentRouter = commentRouter;