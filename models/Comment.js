const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  content: Text,
  authorID: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
  report: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
  price: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema);