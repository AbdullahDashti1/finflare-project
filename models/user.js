const mongoose = require('mongoose');
const Stock = require('./stock');

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
});

const User = mongoose.model('User', userSchema);

module.exports = User;
