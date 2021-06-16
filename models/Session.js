const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Session", sessionSchema);
