const Router = require('express');
const indexRouter = Router();

const { userRouter } = require('./user.route');
const { postRouter } = require('./post.route');
const { commentRouter } = require('./comment.route');
const { loginRouter } = require('../routes/login.route');

indexRouter.use('/auth', loginRouter);
indexRouter.use('/users', userRouter);
indexRouter.use('/users/:userId/posts', postRouter);
indexRouter.use('/users/:userId/posts/:postId/comments', commentRouter);


exports.indexRouter = indexRouter;