const passport = require('passport');
const client = require('../helpers/initRedis');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async function (email, password, cb) {
        try {
            const user = await User.findOne({ email, isDelete: false });
            if (!user) throw createError(401, 'Invalid email or password');

            const result = await user.comparePassword(password);
            if (!result) throw createError(401, 'Invalid email or password');

            const accessToken = jwt.sign(
                { userId: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET_KEY, {
                expiresIn: '1d',
            });
            const refreshToken = jwt.sign(
                { userId: user._id, email: user.email, role: user.role },
                process.env.JWT_REFRESH_KEY, {
                expiresIn: '1y',
            }); 
            client.set(user._id.toString(), refreshToken);
            client.expire(user._id.toString(), 24 * 60 * 60);
            cb(null, { accessToken, refreshToken });
        } catch (error) {
            cb(error);
        }
    }
));