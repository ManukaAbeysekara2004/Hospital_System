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
        required: false
    },

    Color: {
        type: String,
        required: false,
        default: ""
    },

    Appearance: {
        type: String,
        required: false,
        default: ""
    },

    pH: {
        type: Number,
        required: false,
        default: 0.0
    },

    SpecificGravity: {
        type: Number,
        required: false,
        default: 0.0
    },

    Protein: {
        type: String,
        required: false,
        default: ""
    },

    Glucose: {
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
        default: 1450,
        required: false
    },

    PaidStatus: {
        type: Boolean,
        default: false,
        required: false
    }

}, { timestamps: true });

module.exports = mongoose.model('UrineTest', urineTestSchema);