const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    max: 255,
  },
  password: {
    type: String,
    max: 100,
    min: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  cards: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'Card'}
  ],
  ips: [
    {
      type: String,
    }
  ],
  facebookID: {
    type: String,
    required: false, // only required for facebook users
    index: {
      unique: true,
      partialFilterExpression: { facebookID: { $type: 'string' } },
    },
    default: null,
  },
  googleID: {
    type: String,
    required: false, // only required for facebook users
    index: {
      unique: true,
      partialFilterExpression: { googleID: { $type: 'string' } },
    },
    default: null,
  },
  twitterID: {
    type: String,
    required: false, // only required for facebook users
    index: {
      unique: true,
      partialFilterExpression: { twitterID: { $type: 'string' } },
    },
    default: null,
  },
  providerAccessToken: {
    type: String,
    required: false
  },
  providerRefreshToken: {
    type: String,
    required: false
  },
});

module.exports = mongoose.model("User", UserSchema);
