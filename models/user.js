const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  shares: {
    type: Number,
    min: 0,
  },
  price: {
    type: Number,
    min: 0,
  },
  purchaseDate: {
    type: Date,
  },
});

const notesSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  stocks: [stockSchema],
  notes: [notesSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
