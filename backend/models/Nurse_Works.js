const mongoose = require('mongoose');

const nurseWorksSchema = new mongoose.Schema({

    NurseID: {
        type: String,
        required: true,
        ref: 'Nurse',
    },
    PatientID: {
        type: String,
        required: true,
        ref: 'Patient',
    },
    Works: [
        {
            Work: {
                type: String,
                required: true,
            },
            Done: {
                type: Boolean,
                default: false,
                required: true,
            }
        }
    ],
    AllDone: {
        type: Boolean,
        default: false,
        required: true,
    },
    CompleteDate: {
        type: Date,
        default: Date.now,
        required: true,
    }

}, { timestamps: true });

module.exports = mongoose.model('NurseWorks', nurseWorksSchema);