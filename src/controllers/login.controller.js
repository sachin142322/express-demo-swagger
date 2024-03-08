const { getSuccessResponse } = require('../utils/response.util');
const jwt = require('jsonwebtoken');
const client = require('../helpers/initRedis');

exports.login = async (req, res, next) => {
    try {
        res.set('Authorization', `Bearer ${req.user.accessToken}`);
        return res.status(200).json(getSuccessResponse('Successfully Logged In'));
    } catch (error) {
        next(error);
    }
}
 
exports.generateRefreshToken = async (req, res, next) => {
    try {
        const { _id, email, role } = req.user;
        let refreshToken = await client.get(_id.toString());

        const accessToken = jwt.sign(
            { userId: _id, email: email, role: role },
            process.env.JWT_SECRET_KEY, {
            expiresIn: '1d',
        });
        refreshToken = jwt.sign(
            { userId: _id, email: email, role: role },
            process.env.JWT_REFRESH_KEY, {
            expiresIn: '1y',
        });
        client.set(_id.toString(), refreshToken);
        client.expire(_id.toString(), 24 * 60 * 60);
        res.set('Authorization', `Bearer ${accessToken}`);
        return res.json(getSuccessResponse('refresh token generated successfully'));

    } catch (error) {
        next(error);
    }
}

