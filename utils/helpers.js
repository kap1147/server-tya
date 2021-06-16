const Notification = require('../models/Notification');
const fetch = require("node-fetch");
var jwt = require('jsonwebtoken');

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

module.exports = { createNotification, serialize, getToken, getGoogleProfile }
