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

// 01. Laboratory Staff Registration //
//----------------------------------//

exports.Laboratory_Staff_Registration = async (req, res) => {
    try {

        const {
            FullName,
            DateOfBirth,
            Gender,
            NICNumber,
            PhoneNumber,
            Address,
            LaboratoryLicenseNumber,
            Qualifications,
            LabSpecialization,
            AssignedLaboratoryUnit,
            EmployeeID,
            Email,
            Password
        } = req.body;

        // --- Check NIC Number --- //

        const existingNIC = await laboratory_staff.findOne({ NICNumber });

        if (existingNIC) {
            return res.status(400).json({
                message: "NIC Number already registered"
            });
        }

        // --- Check Laboratory License Number --- //

        const existingLicense = await laboratory_staff.findOne({
            LaboratoryLicenseNumber
        });

        if (existingLicense) {
            return res.status(400).json({
                message: "Laboratory License Number already exists"
            });
        }

        // --- Check Employee ID --- //

        const existingEmployeeID = await laboratory_staff.findOne({
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

        // --- Save Laboratory Staff --- //

        const newLaboratoryStaff = new laboratory_staff({
            FullName,
            DateOfBirth,
            Gender,
            NICNumber,
            PhoneNumber,
            Address,
            LaboratoryLicenseNumber,
            Qualifications,
            LabSpecialization,
            AssignedLaboratoryUnit,
            EmployeeID,
            Email,
            Password: hashedPassword,

            // System Fields
            Role: "Laboratory Staff",
            Approve: false
        });

        await newLaboratoryStaff.save();

        res.status(201).json({
            message: "Laboratory Staff registered successfully",
            newLaboratoryStaff
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};


// 02. Laboratory Staff Login //
//----------------------------//

exports.Laboratory_Staff_Login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // --- Check if Email exists --- //
        const existingLaboratoryStaff = await laboratory_staff.findOne({ Email });

        if (!existingLaboratoryStaff) {
            return res.status(404).json({ message: "Laboratory Staff not found" });
        }

        // --- Validate Password --- //
        const isMatch = await bcrypt.compare(Password, existingLaboratoryStaff.Password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", existingLaboratoryStaff });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 03. Get Laboratory Staff Approve Status //
//-----------------------------------------//

exports.Get_Laboratory_Staff_Approve_Status = async (req, res) => {
    try {
        const { laboratoryStaffId } = req.params;

        // --- Check if Laboratory Staff exists --- //
        const existingLaboratoryStaff = await laboratory_staff.findById(laboratoryStaffId);

        if (!existingLaboratoryStaff) {
            return res.status(404).json({ message: "Laboratory Staff not found" });
        }

        res.status(200).json({ message: "Approve status retrieved successfully", Approve: existingLaboratoryStaff.Approve });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 04. Get Laboratory Staff Details //
//----------------------------------//

exports.Get_Laboratory_Staff_Details = async (req, res) => {
    try {
        const { laboratoryStaffId } = req.params;

        // --- Check if Laboratory Staff exists --- //
        const existingLaboratoryStaff = await laboratory_staff.findById(laboratoryStaffId);

        if (!existingLaboratoryStaff) {
            return res.status(404).json({ message: "Laboratory Staff not found" });
        }

        res.status(200).json({ message: "Laboratory Staff details retrieved successfully", existingLaboratoryStaff });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 05. Delete Laboratory Staff //
//-----------------------------//

exports.Delete_Laboratory_Staff = async (req, res) => {
    try {
        const { laboratoryStaffId } = req.params;

        // --- Check if Laboratory Staff exists --- //
        const existingLaboratoryStaff = await laboratory_staff.findById(laboratoryStaffId);

        if (!existingLaboratoryStaff) {
            return res.status(404).json({ message: "Laboratory Staff not found" });
        }

        await existingLaboratoryStaff.deleteOne();

        res.status(200).json({ message: "Laboratory Staff deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};      