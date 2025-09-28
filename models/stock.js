const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: String,
  name: { type: String, required: true },
  shares: { type: Number, required: true },
  price: { type: Number, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Stock', stockSchema);