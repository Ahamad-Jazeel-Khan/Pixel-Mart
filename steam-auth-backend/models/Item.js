// models/Item.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  ownerSteamId: String, // to link items to a user
});

module.exports = mongoose.model("Item", itemSchema);
