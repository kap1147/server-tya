const router = require("express").Router();
require('dotenv').config({path: './utils/config.env'});
/////Functions/////
const { loginSuccess, googleLogin, googleCallback, loginFailed, logout, token } = require('../functions/auth');
const {addToken} = require('../middlewares/auth');
const serializeToken = require('../middlewares/bearer_token');
const { serialize } = require('../utils/helpers');
/////Middlewares/////
//const {authCheck} = require("../middlewares/auth")
/////ROUTES/////
// For testing
router.get('/google/auth', googleLogin);
// Authenticate via passport Google
router.get('/google', googleLogin, addToken);
// Redirect to home page if login succeeded or to /auth/login/failed if failed
router.get('/google/callback', googleCallback);
// Returns login success response with user information
// Authenticate via passport Facebook
router.get('/token', token);
router.get('/', serializeToken, loginSuccess);
// Returns login failed message
router.get('/login/failed', loginFailed);
// Logs User out and ends session
router.get('/logout', serializeToken, logout);

module.exports = router;
