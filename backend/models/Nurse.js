const mongoose = require('mongoose');

const nurseSchema = new mongoose.Schema({

    // Stage 1: Personal Information

    FullName: {
        type: String,
        required: true,
    },
    DateOfBirth: {
        type: Date,
        required: true,
    },
    Gender: {
        type: String,
        required: true,
    },
    NICNumber: {
        type: String,
        required: true,
        unique: true,
    },
    PhoneNumber: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true,
    },

    // Stage 2: Professional Information

    NursingLicenseNumber: {
        type: String,
        required: true,
        unique: true,
    },
    Qualifications: [
        {
            Qualification: {
                type: String,
                required: true,
            }
        }
    ],
    AssignedWard: {
        type: String,
        required: true,
    },
    Designation: {
        type: String,
        required: true,
    },
    EmployeeID: {
        type: String,
        required: true,
        unique: true,
    },

    // Stage 3: Account Setup

    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },

    // System Fields

    Role: {
        type: String,
        default: "Nurse",
        required: true,
    },
    Approve: {
        type: Boolean,
        default: false,
        required: true,
    },

    // Availability 

    InHospitalAvailability: {
        type: Boolean,
        default: false,
        required: true,
    },
    InWork: {
        type: Boolean,
        default: false,
        required: true,
    }

}, { timestamps: true });


module.exports = mongoose.model('Nurse', nurseSchema);