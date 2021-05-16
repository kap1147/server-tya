const passport = require("passport");
const CLIENT_HOME_PAGE_URL = 'https://theyardapp.com';
require('dotenv').config({path: './config/config.env'})
const Profile = require("../models/Profile");

const googleLogin = passport.authenticate('google', {scope: ['email', 'profile']});
const facebookLogin = passport.authenticate('facebook', { scope: ['email', 'public_profile'] });
// return authentication, User and Profile
const loginSuccess = async (req, res) => {
	if(!req.user){
		return res.json({authenticated: false})
	}
    try{
        let profile = await Profile.findOne({userID: req.user._id}).lean();
        const currentUser = {
            id: req.user._id,
            email: req.user.email,
            billingId: profile.billingID,
            shippingId: profile.shippingID,
            imageURL: profile.imageURL,
            alias: profile.alias
        }
        return res.json({ user: currentUser, authenticated: true})
    }catch(err){
        return res.json({authenticated: false, message: err})
    }       
        
}
const loginFailed = async (req, res) => {
    return res.status(401).json({
        authenticated: false,
        message: 'User failed to authenticate.'
    })
}

const logout = async (req, res) => {
    req.logout();
    return res.redirect(CLIENT_HOME_PAGE_URL)
}

const googleCallback = passport.authenticate('google', {
        successRedirect: CLIENT_HOME_PAGE_URL,
        failureRedirect: '/api/auth/login/failed'
})

const facebookCallback = passport.authenticate('facebook', {
        failureRedirect: '/api/auth/'
})


module.exports = {loginSuccess, loginFailed, logout, googleCallback, googleLogin, facebookLogin, facebookCallback };
