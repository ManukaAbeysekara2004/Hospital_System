const mongoose = require('mongoose');

const urineTestSchema = new mongoose.Schema({

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

    Color: {
        type: String,
        required: true,
        default: ""
    },

    Appearance: {
        type: String,
        required: true,
        default: ""
    },

    pH: {
        type: Number,
        required: true,
        default: 0.0
    },

    SpecificGravity: {
        type: Number,
        required: true,
        default: 0.0
    },

    Protein: {
        type: String,
        required: true,
        default: ""
    },

    Glucose: {
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
        default: 1450,
        required: true
    },

    PaidStatus: {
        type: Boolean,
        default: false,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('UrineTest', urineTestSchema);