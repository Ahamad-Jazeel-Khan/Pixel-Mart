const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  tradeId: { type: mongoose.Schema.Types.ObjectId, ref: "Trade", required: true },
  offeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  steamId: String,
  items: Array, // items this user is offering in exchange
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" }
});

module.exports = mongoose.model("Offer", offerSchema);
