const { Router } = require('express');
const loginRouter = Router();
const { login, generateRefreshToken } = require('../controllers/login.controller')
const { authenticateByRefreshToken } = require('../middlewares/auth.middleware');
const passport = require('passport');
require('../authentications/login.authentication');

loginRouter.post('/login', passport.authenticate('local', { session: false }), login);
loginRouter.post('/refreshToken', authenticateByRefreshToken, generateRefreshToken);
module.exports = { loginRouter };

