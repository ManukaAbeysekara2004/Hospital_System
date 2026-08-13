const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

    // --- Patient --- //
    PatientID: {
        type: String,
        required: true,
        ref: 'Patient'
    },

    // --- Appointment Fee --- //
    Appoinment_Fee: [
        {
            AppointmentID: {
                type: String,
                required: false,
                ref: 'Appointment'
            },

            BillName: {
                type: String,
                default: 'Appointment Fee',
                required: true
            },

            Appoinment_Fee: {
                type: Number,
                required: true,
                default: 0,
                min: 0
            }
        }
    ],

    // --- Blood Test Fee --- //
    Blood_test_Fee: [
        {
            BloodTestID: {
                type: String,
                required: false,
                ref: 'BloodTest'
            },

            BillName: {
                type: String,
                default: 'Blood Test',
                required: true
            },

            BloodTestFee: {
                type: Number,
                default: 1350,
                required: true,
                min: 0
            }
        }
    ],

    // --- Urine Test Fee --- //
    Urine_test_Fee: [
        {
            UrineTestID: {
                type: String,
                required: false,
                ref: 'UrineTest'
            },

            BillName: {
                type: String,
                default: 'Urine Test',
                required: true
            },

            UrineTestFee: {
                type: Number,
                default: 1450,
                required: true,
                min: 0
            }
        }
    ],

    // --- Medicine Fee --- //
    Medicine_Fee: [
        {
            MedicineBillID: {
                type: String,
                required: false,
                ref: 'MedicineBill'
            },

            BillName: {
                type: String,
                default: 'Medicine Bill',
                required: true
            },

            MedicinePrice: {
                type: Number,
                default: 0,
                required: true,
                min: 0
            }
        }
    ],

    // --- Full Payment --- //
    Full_Payment: {
        type: Number,
        default: 0,
        required: true,
        min: 0
    },

    // --- Payment Complete Status --- //
    Complete_Full_Payment: {
        type: Boolean,
        default: false,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);