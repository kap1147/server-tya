const Notification = require('../models/Notification');
const Session = require('../models/Session');
const User = require('../models/User');
const fetch = require("node-fetch");
var jwt = require('jsonwebtoken');
require('dotenv').config({path: './config/config.env'});

function deserializeToken(token, flag) {
    try {
        switch (flag) {
            case 'a':
	        return jwt.verify(token, process.env.JWT_ACCESS_SECRET)._id;
            case 'r':
                return jwt.verify(token, process.env.JWT_REFRESH_SECRET)._id;
            default:
	        return false;
        };
    } catch(err) {
        return false;
    }
};

const deserializeAccessToken = (token) => {
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, function(err, decoded){
        if (decoded) return decoded;
        if (err) return false;
    });
}

function createToken(id, flag) {
     switch (flag) {
         case 'a': 
	     return jwt.sign({_id: id}, process.env.JWT_ACCESS_SECRET, {expiresIn: '10m'});
         case 'r':
	     return jwt.sign({_id: id}, process.env.JWT_REFRESH_SECRET, {expiresIn: '6h'});
         default:
	     return false;
     }
};

const createNotification = (data) => {
  Notification.create(data, function (err, doc){
    if(err) return err;
    return true;
  });
};

const serialize = function(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

async function getToken(url = '') {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    //body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function getGoogleProfile(token){
  var decoded = jwt.decode(token);
  return decoded;
};

//function createToken(userID, exp){
//  var token = jwt.sign({ _id: userID }, process.env.JWT_SECRET, {expiresIn: exp});
//  return token;
//};

// Get or create session
async function getSession(userID){
  let session = await Session.findOne({userID: userID});
  if (session){
    Session.deleteOne({_id: session._id}, function(err){
      if (err) console.log(err);
    });
  };
  let refreshToken = createToken(userID, 'r');
  session = await new Session({
    userID: userID,
    refreshToken: refreshToken
  }).save();
  let accessToken = createToken(userID, 'a');   
  return {session, accessToken: accessToken}; 
};

async function getUser(profile){
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
  return currentUser;
};

async function verifySession(id) {
    let session = await Session.findOne({userID: id});
    if (session) {
        jwt.verify(session.refreshToken, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                return false;
                /*
                    err = {
                        name: 'TokenExpiredError',
                        message: 'jwt expired',
                       expiredAt: 1408621000
                    }
               */
            }
            return true
        });
    };
};

async function removeSession(id){
    let session = await Session.findOne({userID: id});
    if (session) {
        await session.remove();
    }
    return
};

module.exports = { createNotification, serialize, getToken, getGoogleProfile, getSession, getUser, verifySession, removeSession, deserializeToken, deserializeAccessToken, createToken}
