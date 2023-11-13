const mongoose = require("mongoose");

const brewerySchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  brewery_type: {
    type: String,
    required: true,
  },
  address_1: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: false, // This field is non-compulsory
    default: 0,
  },
  website_url: {
    type: String,
    required: false, // This makes the website_url optional
  },
  phone: {
    type: String,
    required: false, // This makes the phone optional
  },
});

const Brewery = mongoose.model("Brewery", brewerySchema);

module.exports = Brewery;
