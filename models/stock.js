const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shares: {
        type: Number,
        default: 1
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Stock', stockSchema);