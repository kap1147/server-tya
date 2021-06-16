const CLIENT_HOME_PAGE_URL = 'https://theyardapp.com';
require('dotenv').config({path: './config/config.env'});
const User = require('../models/User');
const Profile = require("../models/Profile");
const { serialize, getToken, getGoogleProfile } = require('../utils/helpers');
// return authentication, User and Profile
const loginSuccess = async (req, res) => {
    if(!req.user){
      console.log('No user!');
      return res.json({authenticated: false})
    }
    try{
	console.log('User found!');
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
    req.logout();
    return res.redirect(CLIENT_HOME_PAGE_URL)
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
    console.log(profile);
    // find current user in UserModel
    let currentUser = await User.findOne({
        googleID: profile.sub 
    }).lean();
    // create new user if the database doesn't have this user
    if (!currentUser){
         currentUser = await new User({
          googleID: profile.sub,
          email: profile.email,
        }).save()
      if (currentUser) {
        // create new profile for user
        await new Profile({
          _id: currentUser.id,
          imageURL: profile.picture,
          alias: profile.name,
          shippingID: null,
          billingID: null
        }).save()
      }
    }
    // TODO
	  // Create session and JWTs 
    return res.send(currentUser);
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

module.exports = {loginSuccess, loginFailed, logout, googleCallback, googleLogin  };
