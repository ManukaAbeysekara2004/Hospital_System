const mongoose = require('mongoose');

const bloodTestSchema = new mongoose.Schema({

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

    TestDate: {
        type: Date,
        default: Date.now,
        required: true
    },

    CompleteStatus: {
        type: Boolean,
        default: false,
        required: false
    },

    Hemoglobin: {
        type: Number,
        required: false,
        default: 0.0
    },

    WBC: {
        type: Number,
        required: false,
        default: 0.0
    },

    RBC: {
        type: Number,
        required: false,
        default: 0.0
    },

    Platelets: {
        type: Number,
        required: false,
        default: 0.0
    },

    BloodSugar: {
        type: Number,
        required: false,
        default: 0.0
    },

    BloodGroup: {
        type: String,
        required: false,
        default: ""
    },

    Remarks: {
        type: String,
        required: false,
        default: ""
    },

    Fee: {
        type: Number,
        default: 1350,
        required: false
    },

    PaidStatus: {
        type: Boolean,
        default: false,
        required: false
    }

}, { timestamps: true });

module.exports = mongoose.model('BloodTest', bloodTestSchema);