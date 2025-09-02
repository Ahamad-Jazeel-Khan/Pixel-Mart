const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const tradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  steamId: { type: String, required: true },
  username: { type: String, required: true },
  item: {
    id: String,
    assetid: String,
    classid: String,
    instanceid: String,
    market_hash_name: String,
    name: String,
    image: String,
    icon_url: String
  },
  listedAt: { type: Date, default: Date.now },
  removedAt: Date,
  isActive: { type: Boolean, default: true }
});

tradeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Trade', tradeSchema);