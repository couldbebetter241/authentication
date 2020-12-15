const jwt = require('jsonwebtoken');
const errOutput = require('http-errors');

module.exports = {
    makeAccessToken: (uuid) => {
        const secretAccess = process.env.ACCESS_SECRET;
        return new Promise((resolve, reject) => {
            const payload = {
                uuid: uuid,
            }
            const options = {
                expiresIn: '300s',
                issuer: 'localhost',
                algorithm: 'HS512',
            }
            jwt.sign(payload, secretAccess, options, (err, token) => {
                if(err) return reject(errOutput.InternalServerError());
                resolve(token);
            })
        })
    },
    makeRefreshToken: (uuid, accToken) => {
        return new Promise((resolve, reject) => {
            const payload = {
                uuid: uuid,
            }
            const options = {
                expiresIn: '1y',
                issuer: 'localhost',
                algorithm: 'HS256',
            }
            jwt.sign(payload, accToken, options, (err, token) => {
                if(err) return reject(errOutput.InternalServerError());
                resolve(token);
            })
        })
    },
    checkRefToken: async (reftoken, secret) => {
        try {
            const res = await jwt.verify(reftoken, secret);
            return res;
        } catch (error) {
            throw errOutput.Unauthorized();
        }
    }
}
