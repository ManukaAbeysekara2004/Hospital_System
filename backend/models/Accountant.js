const mongoose = require('mongoose');

const accountantSchema = new mongoose.Schema({

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

    EmployeeID: {
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
    JobPosition: {
        type: String,
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

    // System Fields

    Role: {
        type: String,
        default: "Accountant",
        required: true,
    },
    Approve: {
        type: Boolean,
        default: false,
        required: true,
    },


}, { timestamps: true });


module.exports = mongoose.model('Accountant', accountantSchema);