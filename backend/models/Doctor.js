const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({

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
    NICPassportNumber: {
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
    ProfilePhoto: {
        type: String,
        required: false,
        default: null,
    },

    // Stage 2: Professional Information

    MedicalLicenseNumber: {
        type: String,
        required: true,
        unique: true,
    },
    Specialization: {
        type: String,
        required: true,
    },
    Qualifications: [
        {
            Qualification: {
                type: String,
                required: true,
            }
        }
    ],
    YearsOfExperience: {
        type: Number,
        required: true,
    },
    Department: {
        type: String,
        required: true,
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

    // Admin approval (optional but useful for hospital system)

    Role: {
        type: String,
        default: "Doctor",
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
    StopAppointments: {
        type: Boolean,
        default: false,
        required: true,
    },

    // Number of appointments And Room Number

    NoOfAppointments: {
        type: Number,
        default: 0,
        required: true,
    },
    RoomNumber: {  
        type: String,
        required: false,
        unique: true,
    },

}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);