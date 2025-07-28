const mongoose = require("mongoose");

const tradeItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  market_hash_name: String,
  image: String,
  price: Number,
});

const tradeSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Steam ID
  items: [tradeItemSchema],
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "listed" }, // listed, traded, cancelled, etc.
});

module.exports = mongoose.model("Trade", tradeSchema);
