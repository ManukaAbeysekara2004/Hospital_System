const mongoose = require('mongoose');

const billPricesSchema = new mongoose.Schema({

    Appointment_Price: {
        type: Number,
        default: 0,
        required: true,
        min: 0
    },

    Blood_Test_Price: {
        type: Number,
        default: 0,
        required: true,
        min: 0
    },

    Urine_Test_Price: {
        type: Number,
        default: 0,
        required: true,
        min: 0
    }

}, { timestamps: true });

module.exports = mongoose.model('BillPrice', billPricesSchema);