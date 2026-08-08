const e = require('express');
const accountant = require('../models/Accountant');
const admin = require('../models/Admin');
const doctor = require('../models/Doctor');
const laboratory_staff = require('../models/Laboratory_Staff');
const nurse = require('../models/Nurse');
const pharmacist = require('../models/Pharmacist');
const receptionist = require('../models/Receptionist');
const patient = require('../models/Patient');
const bcrypt = require('bcryptjs');

// 01. Pharmacist Registration //
//-----------------------------//

exports.Pharmacist_Registration = async (req, res) => {
    try {

        const {
            FullName,
            DateOfBirth,
            Gender,
            NICNumber,
            PhoneNumber,
            Address,
            PharmacyLicenseNumber,
            Qualifications,
            LicenseExpiryDate,
            AssignedPharmacy,
            EmployeeID,
            Email,
            Password
        } = req.body;

        // --- Check NIC Number --- //

        const existingNIC = await pharmacist.findOne({ NICNumber });

        if (existingNIC) {
            return res.status(400).json({
                message: "NIC Number already registered"
            });
        }

        // --- Check Pharmacy License Number --- //

        const existingLicense = await pharmacist.findOne({
            PharmacyLicenseNumber
        });

        if (existingLicense) {
            return res.status(400).json({
                message: "Pharmacy License Number already exists"
            });
        }

        // --- Check Employee ID --- //

        const existingEmployeeID = await pharmacist.findOne({
            EmployeeID
        });

        if (existingEmployeeID) {
            return res.status(400).json({
                message: "Employee ID already exists"
            });
        }

        // --- Validate Phone Number --- //

        if (!/^\d{10}$/.test(PhoneNumber)) {
            return res.status(400).json({
                message: "Phone Number must contain exactly 10 digits"
            });
        }

        // --- Validate Email --- //

        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!emailRegex.test(Email)) {
            return res.status(400).json({
                message: "Email must be a valid @gmail.com address"
            });
        }

        // --- Check Email already exists --- //

        const accountantEmail = await accountant.findOne({ Email });
        const adminEmail = await admin.findOne({ Email });
        const doctorEmail = await doctor.findOne({ Email });
        const labEmail = await laboratory_staff.findOne({ Email });
        const nurseEmail = await nurse.findOne({ Email });
        const pharmacistEmail = await pharmacist.findOne({ Email });
        const receptionistEmail = await receptionist.findOne({ Email });

        if (
            accountantEmail ||
            adminEmail ||
            doctorEmail ||
            labEmail ||
            nurseEmail ||
            pharmacistEmail ||
            receptionistEmail
        ) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // --- Validate Password --- //

        if (Password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // --- Hash Password --- //

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        // --- Save Pharmacist --- //

        const newPharmacist = new pharmacist({
            FullName,
            DateOfBirth,
            Gender,
            NICNumber,
            PhoneNumber,
            Address,
            PharmacyLicenseNumber,
            Qualifications,
            LicenseExpiryDate,
            AssignedPharmacy,
            EmployeeID,
            Email,
            Password: hashedPassword,

            // System Fields
            Role: "Pharmacist",
            Approve: false
        });

        await newPharmacist.save();

        res.status(201).json({
            message: "Pharmacist registered successfully",
            newPharmacist
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 02. Pharmacist Login //
//----------------------//

exports.Pharmacist_Login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // --- Check if Email exists --- //
        const existingPharmacist = await pharmacist.findOne({ Email });

        if (!existingPharmacist) {
            return res.status(404).json({ message: "Pharmacist not found" });
        }

        // --- Validate Password --- //
        const isMatch = await bcrypt.compare(Password, existingPharmacist.Password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", existingPharmacist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 03. Get Pharmacist Approve Status //
//-----------------------------------//

exports.Get_Pharmacist_Approve_Status = async (req, res) => {
    try {
        const { pharmacistId } = req.params;

        // --- Check if Pharmacist exists --- //
        const existingPharmacist = await pharmacist.findById(pharmacistId);

        if (!existingPharmacist) {
            return res.status(404).json({ message: "Pharmacist not found" });
        }

        res.status(200).json({ message: "Approve status retrieved successfully", approve: existingPharmacist.Approve });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 04. Get pharmacist details //
//----------------------------//

exports.Get_Pharmacist_Details = async (req, res) => {
    try {
        const { pharmacistId } = req.params;

        // --- Check if Pharmacist exists --- //
        const existingPharmacist = await pharmacist.findById(pharmacistId);

        if (!existingPharmacist) {
            return res.status(404).json({ message: "Pharmacist not found" });
        }

        res.status(200).json({ message: "Pharmacist details retrieved", pharmacistDetails: existingPharmacist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 05. Delete Pharmacist //
//-----------------------//

exports.Delete_Pharmacist = async (req, res) => {
    try {
        const { pharmacistId } = req.params;

        // --- Check if Pharmacist exists --- //
        const existingPharmacist = await pharmacist.findById(pharmacistId);

        if (!existingPharmacist) {
            return res.status(404).json({ message: "Pharmacist not found" });
        }

        await existingPharmacist.deleteOne();

        res.status(200).json({ message: "Pharmacist deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};      