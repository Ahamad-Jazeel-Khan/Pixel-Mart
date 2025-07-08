// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  steamId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  avatar: { type: String }, // storing the profile picture URL
  email: { type: String },
  tradeUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
