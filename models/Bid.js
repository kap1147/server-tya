const mongoose = require("mongoose");

const bidSchema = mongoose.Schema({
  contractorID: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
  offer: Number,
  status: {
    type: String,
    default: "open",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  message: String,
  date: {
    type: Date,
    default: Date.now
  },
  appointment: {
    type: String,
    default: "asap"
  }
});

module.exports = mongoose.model("Bid", bidSchema);