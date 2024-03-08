const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/user.model');
const client = require('../helpers/initRedis');
const passport = require('passport');
const { getFailuerResponse } = require('../utils/response.util');

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const user = await User.findOne({ _id: jwt_payload.userId, isDelete: false }, { password: 0 }).lean();
        if (!user) return done(null, false);
        return done(null, user);
    } catch (error) {
        done(error);
    }
}));

exports.isAuthenticate = function (req, res, next) {
    try {
        passport.authenticate("jwt", { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(401).send(getFailuerResponse(401,'unauthorized'))
            }
            req.user = user;
            next();
        })(req, res);
    } catch (error) {
        next(error)
    }
};

exports.authorization = (roles) => {
    return async (req, res, next) => {
        try {
            const { role } = req.user;
            if (!roles.includes(role)) throw createError(403, 'permission denied');
            next();
        } catch (error) {
            next(error);
        }
    }
}

exports.authenticateByRefreshToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_KEY);

            let refreshToken = await client.get(decoded.userId);
            const verifyRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

            if (refreshToken !== token || !verifyRefreshToken) throw createError.Unauthorized();

            const user = await User.findOne({ _id: decoded.userId, isDelete: false }).lean();
            if (!user) throw createError.Unauthorized();
            req.user = user;
            next();
        } else {
            throw createError.Unauthorized('Please Login First');
        }
    } catch (error) {
        next(error);
    }
}
