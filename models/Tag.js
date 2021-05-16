const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true
  },
  description: String,
});

module.exports = mongoose.model("Tag", tagSchema);