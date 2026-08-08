const accountant = require('../models/Accountant');
const admin = require('../models/Admin');
const doctor = require('../models/Doctor');
const laboratory_staff = require('../models/Laboratory_Staff');
const nurse = require('../models/Nurse');
const pharmacist = require('../models/Pharmacist');
const receptionist = require('../models/Receptionist');
const patient = require('../models/Patient');
const bcrypt = require('bcryptjs');

// 01. Admin Registration //
//------------------------//

exports.Admin_Registration = async (req, res) => {
    try {

        const {
            FullName,
            DateOfBirth,
            Gender,
            NICNumber,
            PhoneNumber,
            Address,
            AdminID,
            Department,
            HospitalBranch,
            Email,
            Password
        } = req.body;

        // --- Check NIC Number --- //
        
        const existingNIC = await admin.findOne({ NICNumber });

        if (existingNIC) {
            return res.status(400).json({
                message: "NIC Number already registered"
            });
        }

        // --- Check Admin ID --- //

        const existingAdminID = await admin.findOne({ AdminID });

        if (existingAdminID) {
            return res.status(400).json({
                message: "Admin ID already exists"
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

        // --- Password Validation --- //

        if (Password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // --- Hash Password --- //

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        // --- Save Admin --- //

        const newAdmin = new admin({
            FullName,
            DateOfBirth,
            Gender,
            NICNumber,
            PhoneNumber,
            Address,
            AdminID,
            Department,
            HospitalBranch,
            Email,
            Password: hashedPassword,

            // System Fields
            Role: "Admin",
            Approve: false
        });

        await newAdmin.save();

        res.status(201).json({
            message: "Admin registered successfully",
            newAdmin
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};


// 02. Admin Login //
//-----------------//

exports.Admin_Login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // --- Check if Admin exists --- //
        const existingAdmin = await admin.findOne({ Email });

        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // --- Validate Password --- //
        const isMatch = await bcrypt.compare(Password, existingAdmin.Password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", existingAdmin });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 03. Get Admin Approve Status //
//------------------------------//

exports.Get_Admin_Approve_Status = async (req, res) => {
    try {
        const { adminId } = req.params;

        // --- Check if Admin exists --- //
        const existingAdmin = await admin.findById(adminId);

        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ message: "Approve status retrieved", approve: existingAdmin.Approve });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 04. Get Admin Details //
//-----------------------//

exports.Get_Admin_Details = async (req, res) => {
    try {
        const { adminId } = req.params;

        // --- Check if Admin exists --- //
        const existingAdmin = await admin.findById(adminId);

        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ message: "Admin details retrieved", adminDetails: existingAdmin });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 05. Delete Admin //
//------------------//

exports.Delete_Admin = async (req, res) => {
    try {
        const { adminId } = req.params;

        // --- Check if Admin exists --- //
        const existingAdmin = await admin.findById(adminId);

        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        await existingAdmin.deleteOne();

        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};