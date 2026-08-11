const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({

    TabletName: {
        type: String,
        required: true
    },

    Quantity: {
        type: Number,
        required: true,
        min: 0
    },

    UnitPrice: {
        type: Number,
        required: true,
        min: 0
    }

}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);