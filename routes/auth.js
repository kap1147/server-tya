const router = require("express").Router();
/////Functions/////
const { loginSuccess } = require('../functions/auth');
/////Middlewares/////
//const {authCheck} = require("../middlewares/auth")
/////ROUTES/////
// Returns login success response with user information
router.get('/login/success', loginSuccess);

module.exports = router;