const sha256 = require('crypto-js/sha256');
const USER = require('../models/users');
const { uuidSchema } = require('../helpers/validate');
const bcrypt = require('bcryptjs');
const errOutput = require('http-errors');
const jwtLogic = require('../helpers/jwtLogic');
const btoa = require('btoa');
const atob = require('atob');

exports.sendTokens = async (req, res, next) => {
    try {
        await uuidSchema.validateAsync(req.body);
        const user = await USER.findOne({ uuid: req.body.uuid });

        if (!user) {
            throw errOutput.NotFound('Not registered.');
        }

        const accessToken = await jwtLogic.makeAccessToken(req.body.uuid);
        const refToken = await jwtLogic.makeRefreshToken(user.uuid, accessToken);
        const salt = await bcrypt.genSalt(12);
        const hashedRefToken = await sha256(refToken);
        const bcryptedToken = await bcrypt.hash(hashedRefToken.toString(), salt);
        await user.updateOne({ uuid: user.uuid, reftoken: bcryptedToken});
        const refTokenInBase64 = await btoa(refToken);
        res
            .status(200)
            .send({ 
                accessToken: accessToken, 
                refreshToken: refTokenInBase64,
            })
    }
    catch (e) {
        if(e.isJoi === true) e.status = 422;
        next(e);
    }
}

exports.refreshTokens = async (req, res, next) => {
    try {
        const accTokenInClientReq = req.body.accessToken ? req.body.accessToken: null;
        if (!accTokenInClientReq) {
            throw errOutput.BadRequest();
        }
        const refTokenInClientReq = req.body.refreshToken ? req.body.refreshToken: null;
        if (!refTokenInClientReq) {
            throw errOutput.BadRequest();
        }
        const refTokenDecoded = atob(refTokenInClientReq);
        const accessTokenDecoded = atob(accTokenInClientReq);
        const indexOfUuid = accessTokenDecoded.indexOf('"uuid":"');
        const userId = accessTokenDecoded.slice(indexOfUuid+8, indexOfUuid+44);
        const userFromDb = await USER.findOne({ uuid: userId }, (err, item) => {
            if (err) throw errOutput.BadRequest();
            return item;
        })
        const hashed = await sha256(refTokenDecoded);
        const refTokenValidation = await bcrypt.compare(hashed.toString(), userFromDb.reftoken);
        if (!refTokenValidation) {
            throw errOutput.Unauthorized();
        }
        const salt = await bcrypt.genSalt(12);
        const user = await jwtLogic.checkRefToken(refTokenDecoded, accTokenInClientReq);
        const accessToken = await jwtLogic.makeAccessToken(user);
        const refToken = await jwtLogic.makeRefreshToken(userFromDb.uuid, accessToken);
        const refTokenHash = await sha256(refToken);
        const bcryptedToken = await bcrypt.hash(refTokenHash.toString(), salt);
        await userFromDb.updateOne({ uuid: userFromDb.uuid, reftoken: bcryptedToken});
        const refTokenInBase64 = await btoa(refToken);

        res
            .status(200)
            .send({ 
                    accessToken: accessToken, 
                    refreshToken: refTokenInBase64,
                  })

    } catch (error) {
        next(error);
    }
}
