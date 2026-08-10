const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({

    FullName: {
        type: String,
        required: true,
    },
    NICNumber: {
        type: String,
        required: true,
        unique: true,
    },
    Gender: {
        type: String,
        required: true,
    },
    DateOfBirth: {
        type: Date,
        required: true,
    },
    ContactNumber: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true,
    },
    PatientRegID: {
        type: String,
        required: true,
        unique: true,
    },
    RegistrationDate: {
        type: Date,
        default: Date.now,
    },


}, { timestamps: true });


module.exports = mongoose.model('Patient', patientSchema);