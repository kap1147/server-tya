var jwt = require('jsonwebtoken');
const CLIENT_HOME_PAGE_URL = 'https://theyardapp.com';
require('dotenv').config({path: './config/config.env'});
const User = require('../models/User');
const Profile = require("../models/Profile");
const { serialize, getToken, getGoogleProfile, getSession, getUser, removeSession, deserializeToken, createToken } = require('../utils/helpers');

const token = (req, res) => {
    // Get refresh token from cookie
    let token = req.cookies.refreshToken;
    let id = deserializeToken(token, 'r');
    // create new access token
    let accessToken = createToken(id, 'a');
    // send new token to client
    return res.json({success: true, token: accessToken});
};

// return authentication, User and Profile
const loginSuccess = async (req, res) => {
    try{
        let profile = await Profile.findById(req.user._id).lean();
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
    await removeSession(req.user._id);
    res.clearCookie('refreshToken');
    return res.send({authenticated: false});
}

const googleCallback = async (req, res) => {
  if (req.query.code) {
    let data = serialize({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code: req.query.code,
      grant_type: 'authorization_code',
      redirect_uri: 'https://theyardapp.com/api/auth/google/callback',
    });
    const redirectURI = ('https://oauth2.googleapis.com/token?' + data);
    const tokenObj = await getToken(redirectURI);
    const profile =  getGoogleProfile(tokenObj.id_token);
    // find current user in UserModel
    let currentUser = await getUser(profile);
    // TODO
    // Create session and JWTs
    // get session
    let {session, accessToken} = await getSession(currentUser._id);
    res.cookie('refreshToken', session.refreshToken, {maxAge: 360000});
    res.cookie('accessToken', accessToken, {maxAge: 36000});
    return res.redirect(CLIENT_HOME_PAGE_URL);
  };
}

const googleLogin = (req, res) => {
  let data = serialize({
    client_id: process.env.GOOGLE_CLIENT_ID,
    scope: 'email profile',
    redirect_uri: 'https://theyardapp.com/api/auth/google/callback',
    response_type: 'code'
  })
  const redirectURI = ('https://accounts.google.com/o/oauth2/v2/auth?' + data);
  res.redirect(redirectURI);
};

module.exports = {loginSuccess, loginFailed, logout, googleCallback, googleLogin, token};
