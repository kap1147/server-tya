const router = require("express").Router();
const passport = require("passport");
/////Functions/////
const { loginSuccess, googleLogin, googleCallback, facebookLogin, facebookCallback, loginFailed, logout } = require('../functions/auth');
/////Middlewares/////
//const {authCheck} = require("../middlewares/auth")
/////ROUTES/////
// Authenticate via passport Google
router.get('/google', googleLogin);
// Redirect to home page if login succeeded or to /auth/login/failed if failed
router.get('/google/callback', googleCallback);
// Returns login success response with user information
// Authenticate via passport Facebook
router.get('/facebook', facebookLogin);
// Redirect to home page if login succeeded or to /auth/login/failed if failed
router.get('/facebook/callback',
	passport.authenticate('facebook', {failureRedirect: '/api/auth/login'}),
	function(req, res) {
		// Successful authentication, redirect home.
		res.redirect('/');
	});

router.get('/', loginSuccess);
// Returns login failed message
router.get('/login/failed', loginFailed);
// Logs User out and ends session
router.get('/logout', logout);

module.exports = router;
