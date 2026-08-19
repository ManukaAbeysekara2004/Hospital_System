const accountant = require('../models/Accountant');
const admin = require('../models/Admin');
const doctor = require('../models/Doctor');
const laboratory_staff = require('../models/Laboratory_Staff');
const nurse = require('../models/Nurse');
const pharmacist = require('../models/Pharmacist');
const receptionist = require('../models/Receptionist');
const patient = require('../models/Patient');
const appointment = require('../models/Appointment');
const nurseWorks = require('../models/Nurse_Works');
const bloodTest = require('../models/Blood_Test');
const urineTest = require('../models/Urine_Test');
const medicine = require('../models/Medicine');
const medicineBill = require('../models/Medicine_Bill');
const payment = require('../models/Payment');
const billPrice = require('../models/Bill_Prices');
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

        // --- Check Approve Status --- //
        if (existingReceptionist.Approve === false) {
            return res.status(403).json({ message: "Your account has not been approved yet" });
        }

        res.status(200).json({ message: "Login successful", existingReceptionist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 03. Get All Receptionist Details //
//----------------------------------//

exports.Get_All_Receptionist_Details = async (req, res) => {
    try {
        const allReceptionist = await receptionist.find();

        if (allReceptionist.length === 0) {
            return res.status(404).json({ message: "No Receptionist Found" });
        }

        res.status(200).json({ message: "All Receptionist Details Retrieved", allReceptionist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 04. Get Receptionist Approve Status //
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


// 05. Get Receptionist Details //
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


// 06. Delete Receptionist //
//-------------------------//

exports.Delete_Receptionist = async (req, res) => {
    try {
        const { receptionistId, Password } = req.params;

        // --- Check if Receptionist exists --- //
        const existingReceptionist = await receptionist.findById(receptionistId);

        if (!existingReceptionist) {
            return res.status(404).json({ message: "Receptionist not found" });
        }

        // --- Validate Password -- //
        const isMatch = await bcrypt.compare(Password, existingReceptionist.Password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // --- Delete Receptionist -- //
        await existingReceptionist.deleteOne();

        res.status(200).json({ message: "Receptionist deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ------------------------ Update User ------------------------//

// 07. Update Phone Number //
//-------------------------//

exports.Update_Phone_Number = async (req, res) => {
    try {
        const { receptionistId } = req.params;
        const { PhoneNumber } = req.body;

        // --- Check if Receptionist exists --- //
        const existingReceptionist = await receptionist.findById(receptionistId);

        if (!existingReceptionist) {
            return res.status(404).json({ message: "Receptionist not found" });
        }

        // --- Update Phone Number --- //
        existingReceptionist.PhoneNumber = PhoneNumber;
        await existingReceptionist.save();

        res.status(200).json({ message: "Phone Number updated successfully", existingReceptionist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 08. Update Password //
//---------------------//

exports.Update_Password = async (req, res) => {
    try {
        const { receptionistId } = req.params;
        const { OldPassword, NewPassword } = req.body;

        // --- Check if Receptionist exists --- //
        const existingReceptionist = await receptionist.findById(receptionistId);

        if (!existingReceptionist) {
            return res.status(404).json({ message: "Receptionist not found" });
        }

        // --- Validate Old Password --- //
        const isOldPasswordValid = await bcrypt.compare(OldPassword, existingReceptionist.Password);

        if (!isOldPasswordValid) {
            return res.status(400).json({ message: "Invalid old password" });
        }

        // --- Validate New Password --- //
        if (!NewPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        if (NewPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters long" });
        }

        // --- Hash New Password --- //
        const hashedPassword = await bcrypt.hash(NewPassword, 10);

        // --- Update Password --- //
        existingReceptionist.Password = hashedPassword;
        await existingReceptionist.save();

        res.status(200).json({ message: "Pharmacist password updated", pharmacistDetails: existingReceptionist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};