const accountant = require('../models/Accountant');
const admin = require('../models/Admin');
const doctor = require('../models/Doctor');
const laboratory_staff = require('../models/Laboratory_Staff');
const nurse = require('../models/Nurse');
const pharmacist = require('../models/Pharmacist');
const receptionist = require('../models/Receptionist');
const patient = require('../models/Patient');
const bcrypt = require('bcryptjs');

// 01. Add Patient Record //
//------------------------//

exports.Add_Patient_Record = async (req, res) => {
    try {

        const {
            FullName,
            NICNumber,
            Gender,
            DateOfBirth,
            ContactNumber,
            Address
        } = req.body;

        // --- Check NIC Number --- //
        const existingNIC = await patient.findOne({ NICNumber });

        if (existingNIC) {
            return res.status(400).json({
                message: "NIC Number already registered"
            });
        }


        // --- Validate Contact Number --- //

        if (!/^\d{10}$/.test(ContactNumber)) {
            return res.status(400).json({
                message: "Contact Number must contain exactly 10 digits"
            });
        }

        // --- Generate Patient Registration ID --- //

        const lastPatient = await patient.findOne()
            .sort({ PatientRegID: -1 });

        let PatientRegID;

        if (!lastPatient) {

            // First patient
            PatientRegID = "PAT-00000001";

        } else {

            // Get number from existing PatientRegID
            const lastNumber = parseInt(
                lastPatient.PatientRegID.replace("PAT-", "")
            );

            const newNumber = lastNumber + 1;

            PatientRegID = `PAT-${String(newNumber).padStart(8, "0")}`;
        }

        // --- Generate Patient Registration ID --- //

        const newPatient = new patient({
            FullName,
            NICNumber,
            Gender,
            DateOfBirth,
            ContactNumber,
            Address,
            PatientRegID
        });

        await newPatient.save();

        res.status(201).json({ message: "Patient registered successfully", newPatient });
    
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 02. Search Patient //
//--------------------//

exports.Search_Patient = async (req, res) => {
    try {
        const { NICNumber } = req.params;

        // --- Check if Patient exists --- //
        const existingPatient = await patient.findOne({ NICNumber });

        if (!existingPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({ message: "Patient found successfully", existingPatient });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 03. Delete Patient //
//--------------------//

exports.Delete_Patient = async (req, res) => {
    try {
        const { patientId } = req.params;

        // --- Check if Patient exists --- //
        const existingPatient = await patient.findById(patientId);

        if (!existingPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        await existingPatient.deleteOne();

        res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};          