const mongoose = require('mongoose');
const Stock = require('./stock');

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
  stocks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Stock'}],
  notes: [notesSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
