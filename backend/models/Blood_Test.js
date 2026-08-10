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
        required: true
    },

    Hemoglobin: {
        type: Number,
        required: true,
        default: 0.0
    },

    WBC: {
        type: Number,
        required: true,
        default: 0.0
    },

    RBC: {
        type: Number,
        required: true,
        default: 0.0
    },

    Platelets: {
        type: Number,
        required: true,
        default: 0.0
    },

    BloodSugar: {
        type: Number,
        required: true,
        default: 0.0
    },

    BloodGroup: {
        type: String,
        required: true,
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
        required: true
    },

    PaidStatus: {
        type: Boolean,
        default: false,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('BloodTest', bloodTestSchema);