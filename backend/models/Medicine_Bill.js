const mongoose = require('mongoose');

const medicineBillSchema = new mongoose.Schema({

    PatientID: {
        type: String,
        required: true,
        ref: 'Patient'
    },

    DoctorID: {
        type: String,
        required: true,
        ref: 'Doctor'
    },

    CompleteStatus: {
        type: Boolean,
        default: false,
        required: true
    },

    Added_Medicines: [
        {
            MedicineName: {
                type: String,
                required: false,
            },
            Quantity: {
                type: Number,
                required: false,
                min: 0
            },
            Price: {
                type: Number,
                required: false,
                min: 0
            },
            Added: {
                type: Boolean,
                default: false,
                required: false
            }
        }
    ],

    Date: {
        type: Date,
        required: true,
        default: Date.now
    },

    Total_Bill: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },

    PaidStatus: {
        type: Boolean,
        default: false,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('MedicineBill', medicineBillSchema);