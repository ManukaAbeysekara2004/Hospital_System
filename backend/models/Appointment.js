const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

    PatientID: {
        type: String,
        required: true,
        ref: 'Patient',
    },
    DoctorID: {
        type: String,
        required: true,
        ref: 'Doctor',
    },
    DoctorNote: {
        type: String,
        required: false,
        default: "",
    },
    AppointmentStatus: {
        type: String,
        required: false,
        default: "Pending",
    },
    appointmentDate: {
        type: Date,
        default: Date.now,
    },
    Fee: {
        type: Number,
        required: false,
        default: 2000,
    },
    PaidStatus: {
        type: Boolean,
        required: false,
        default: false,
    },

}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);