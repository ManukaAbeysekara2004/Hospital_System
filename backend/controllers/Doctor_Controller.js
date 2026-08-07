const accountant = require('../models/Accountant');
const admin = require('../models/Admin');
const doctor = require('../models/Doctor');
const laboratory_staff = require('../models/Laboratory_Staff');
const nurse = require('../models/Nurse');
const pharmacist = require('../models/Pharmacist');
const receptionist = require('../models/Receptionist');
const bcrypt = require('bcryptjs');

// 01. Doctor Registration //
//-------------------------//

exports.Doctor_Registration = async (req, res) => {
    try {

        const {
            FullName,
            DateOfBirth,
            Gender,
            NICPassportNumber,
            PhoneNumber,
            Address,
            ProfilePhoto,
            MedicalLicenseNumber,
            Specialization,
            Qualifications,
            YearsOfExperience,
            Department,
            Email,
            Password
        } = req.body;

        
        // --- Check NIC / Passport Number --- //
        
        const existingNIC = await doctor.findOne({ NICPassportNumber });

        if (existingNIC) {
            return res.status(400).json({
                message: "NIC / Passport Number already registered"
            });
        }

        // --- Check Medical License Number --- //
        
        const existingLicense = await doctor.findOne({
            MedicalLicenseNumber
        });

        if (existingLicense) {
            return res.status(400).json({
                message: "Medical License Number already exists"
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

        // --- Save Doctor --- //

        const newDoctor = new doctor({
            FullName,
            DateOfBirth,
            Gender,
            NICPassportNumber,
            PhoneNumber,
            Address,
            ProfilePhoto,
            MedicalLicenseNumber,
            Specialization,
            Qualifications,
            YearsOfExperience,
            Department,
            Email,
            Password: hashedPassword,

            // System Fields
            Role: "Doctor",
            Approve: false,
            InHospitalAvailability: false,
            StopAppointments: false
        });

        await newDoctor.save();

        res.status(201).json({
            message: "Doctor registered successfully",
            newDoctor
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};


// 02. Doctor Login //
//------------------//

exports.Doctor_Login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // --- Check if Doctor exists --- //
        const existingDoctor = await doctor.findOne({ Email });

        if (!existingDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // --- Validate Password --- //
        const isMatch = await bcrypt.compare(Password, existingDoctor.Password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", existingDoctor });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 03. Get Doctor Approve Status //
//-------------------------------//

exports.Get_Doctor_Approve_Status = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // --- Check if Doctor exists --- //
        const existingDoctor = await doctor.findById(doctorId);

        if (!existingDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({ message: "Approve status retrieved successfully", approve: existingDoctor.Approve });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};