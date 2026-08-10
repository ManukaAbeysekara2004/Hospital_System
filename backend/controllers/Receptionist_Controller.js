const accountant = require('../models/Accountant');
const admin = require('../models/Admin');
const doctor = require('../models/Doctor');
const laboratory_staff = require('../models/Laboratory_Staff');
const nurse = require('../models/Nurse');
const pharmacist = require('../models/Pharmacist');
const receptionist = require('../models/Receptionist');
const patient = require('../models/Patient');
const appointment = require('../models/Appointment');
const bcrypt = require('bcryptjs');

// 01. Receptionist Registration //
//-------------------------------//

exports.Receptionist_Registration = async (req, res) => {
    try {

        const {
            FullName,
            DateOfBirth,
            Gender,
            NICNumber,
            PhoneNumber,
            Address,
            EmployeeID,
            AssignedDeskCounter,
            Languages,
            Email,
            Password
        } = req.body;

        // --- Check NIC Number --- //

        const existingNIC = await receptionist.findOne({ NICNumber });

        if (existingNIC) {
            return res.status(400).json({
                message: "NIC Number already registered"
            });
        }

        // --- Check Employee ID --- //

        const existingEmployeeID = await receptionist.findOne({
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

        // --- Save Receptionist --- //

        const newReceptionist = new receptionist({
            FullName,
            DateOfBirth,
            Gender,
            NICNumber,
            PhoneNumber,
            Address,
            EmployeeID,
            AssignedDeskCounter,
            Languages,
            Email,
            Password: hashedPassword,

            // System Fields
            Role: "Receptionist",
            Approve: false
        });

        await newReceptionist.save();

        res.status(201).json({
            message: "Receptionist registered successfully",
            newReceptionist
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};


// 02. Receptionist Login //
//------------------------//

exports.Receptionist_Login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // --- Check if Receptionist exists --- //
        const existingReceptionist = await receptionist.findOne({ Email });

        if (!existingReceptionist) {
            return res.status(404).json({ message: "Receptionist not found" });
        }

        // --- Validate Password --- //
        const isMatch = await bcrypt.compare(Password, existingReceptionist.Password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", existingReceptionist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 03. Get Receptionist Approve Status //
//-------------------------------------//

exports.Get_Receptionist_Approve_Status = async (req, res) => {
    try {
        const { receptionistId } = req.params;

        // --- Check if Receptionist exists --- //
        const existingReceptionist = await receptionist.findById(receptionistId);

        if (!existingReceptionist) {
            return res.status(404).json({ message: "Receptionist not found" });
        }

        res.status(200).json({ message: "Approve status retrieved successfully", approve: existingReceptionist.Approve });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 04. Get Receptionist Details //
//------------------------------//

exports.Get_Receptionist_Details = async (req, res) => {
    try {
        const { receptionistId } = req.params;

        // --- Check if Receptionist exists --- //
        const existingReceptionist = await receptionist.findById(receptionistId);

        if (!existingReceptionist) {
            return res.status(404).json({ message: "Receptionist not found" });
        }

        res.status(200).json({ message: "Receptionist details retrieved", receptionistDetails: existingReceptionist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 05. Delete Receptionist //
//-------------------------//

exports.Delete_Receptionist = async (req, res) => {
    try {
        const { receptionistId } = req.params;

        // --- Check if Receptionist exists --- //
        const existingReceptionist = await receptionist.findById(receptionistId);

        if (!existingReceptionist) {
            return res.status(404).json({ message: "Receptionist not found" });
        }

        await existingReceptionist.deleteOne();

        res.status(200).json({ message: "Receptionist deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};              