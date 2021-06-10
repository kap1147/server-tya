const Notification = require('../models/Notification');

const createNotification = (data) => {
  Notification.create(data, function (err, doc){
    if(err) return err;
    return true;
  });
};

module.exports = { createNotification }
