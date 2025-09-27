const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: String,
  name: { type: String, required: true },
  shares: { type: Number, required: true },
  price: { type: Number, required: true }
});

module.exports = mongoose.model('Stock', stockSchema);