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
            Password,
            RoomNumber
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

        // --- Check Room Number already exists --- //

        const existingRoomNumber = await doctor.findOne({ RoomNumber });

        if (existingRoomNumber) {
            return res.status(400).json({
                message: "Room Number already exists"
            });
        }

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
            StopAppointments: false,

            // Number of Appointments and Room Number 
            NoOfAppointments: 0,
            RoomNumber: RoomNumber
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

        // --- Check if Doctor is Approved --- //
        if (!existingDoctor.Approve) {
            return res.status(403).json({ message: "Doctor account is not approved yet" });
        }

        // --- Change Availability to True --- //
        existingDoctor.InHospitalAvailability = true;
        await existingDoctor.save();

        res.status(200).json({ message: "Login successful", existingDoctor });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 03. Doctor Logout //
//-------------------//

exports.Doctor_Logout = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // --- Check if Doctor exists --- //
        const existingDoctor = await doctor.findById(doctorId);

        if (!existingDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // --- Change Availability to False --- //
        existingDoctor.InHospitalAvailability = false;
        await existingDoctor.save();

        res.status(200).json({ message: "Logout successful", existingDoctor });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 04. Get Doctor Approve Status //
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


// 05. Get Doctor is In-Hospital Availability Status //
//---------------------------------------------------//

exports.Get_Doctor_InHospital_Availability_Status = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // --- Check if Doctor exists --- //
        const existingDoctor = await doctor.findById(doctorId);

        if (!existingDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({ message: "In-Hospital availability status retrieved successfully", inHospitalAvailability: existingDoctor.InHospitalAvailability });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 06. Get Doctor Stop Appointments Status //
//-----------------------------------------//

exports.Get_Doctor_Stop_Appointments_Status = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // --- Check if Doctor exists --- //
        const existingDoctor = await doctor.findById(doctorId);

        if (!existingDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({ message: "Stop appointments status retrieved successfully", stopAppointments: existingDoctor.StopAppointments });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 07. Update Doctor stop Appoinment Status //
//------------------------------------------//

exports.Update_Doctor_Stop_Appointments_Status = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { StopAppointments } = req.body;

        // --- Check if Doctor exists --- //
        const existingDoctor = await doctor.findById(doctorId);

        if (!existingDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // --- Update Doctor stop Appointments Status --- //
        existingDoctor.StopAppointments = StopAppointments;
        await existingDoctor.save();

        res.status(200).json({ message: "Doctor stop appointments status updated successfully", existingDoctor });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 08. Get Doctor Details //
//------------------------//

exports.Get_Doctor_Details = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // --- Check if Doctor exists --- //
        const existingDoctor = await doctor.findById(doctorId);

        if (!existingDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({ message: "Doctor details retrieved successfully", doctorDetails: existingDoctor });
    } catch (error) {  
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 09. Delete Doctor //
//-------------------//

exports.Delete_Doctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // --- Check if Doctor exists --- //
        const existingDoctor = await doctor.findById(doctorId);

        if (!existingDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        await existingDoctor.deleteOne();

        res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};  