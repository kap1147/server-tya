const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
    name: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
});

module.exports = mongoose.model("Address", AddressSchema);
