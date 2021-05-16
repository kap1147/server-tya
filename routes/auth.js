const router = require("express").Router();
/////Functions/////
const { loginSuccess, googleLogin, googleCallback, loginFailed, logout } = require('../functions/auth');
/////Middlewares/////
//const {authCheck} = require("../middlewares/auth")
/////ROUTES/////
// Authenticate via passport Google
router.get('/google', googleLogin);
// Redirect to home page if login succeeded or to /auth/login/failed if failed
router.get('/google/callback', googleCallback);
// Returns login success response with user information
router.get('/', loginSuccess);
// Returns login failed message
router.get('/login/failed', loginFailed);
// Logs User out and ends session
router.get('/logout', logout);

module.exports = router;