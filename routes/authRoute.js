const router = require('express').Router();
const sendRefreshAndAccessTokens = require('../controllers/auth');

router.post('/getTokens', sendRefreshAndAccessTokens.sendTokens);
router.post('/refresh', sendRefreshAndAccessTokens.refreshTokens);

module.exports = router;