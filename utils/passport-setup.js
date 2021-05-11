var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Profile = require('../models/Profile');
const passport = require('passport');
require('dotenv').config({path: './config.env'})

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser(async (id, done) => {
  
  try {
    var user = await User.findById(id);
    if (!user) done(new Error("Failed to deserialize an user."));
    done(null, user);
  } catch (e) {
    done(new Error(e))
  }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    // find current user in UserModel
    let currentUser = await User.findOne({
        googleID: profile.id 
    }).lean();
    // create new user if the database doesn't have this user
    if (!currentUser){
         currentUser = await new User({
          googleID: profile.id,
          email: profile._json.email,
          providerRefreshToken: refreshToken
        }).save()
        if (currentUser) {
          // create new profile for user
          await new Profile({
          userID: currentUser.id,
          imageURL: profile._json.picture,
          alias: profile._json.name,
          shippingID: null,
          billingID: null
        }).save()
        }
    }
    done(null, currentUser);
  }
));