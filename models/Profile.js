const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  userID: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User',
      unique: true
    },
  alias: {
      type: String,
      max: 25,
  },
  imageURL: String,
  billingID: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Address',
    required: false, // only required for facebook users
    index: {
      unique: true,
      partialFilterExpression: { billingID: { $type: 'string' } },
    },
    default: null,
  },
  shippingID: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Address',
    required: false, // only required for facebook users
    index: {
      unique: true,
      partialFilterExpression: { shippingID: { $type: 'string' } },
    },
    default: null,
  }
});

module.exports = mongoose.model("Profile", ProfileSchema);
