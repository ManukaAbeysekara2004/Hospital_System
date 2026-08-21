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
            MedicalLicenseNumber,
            Specialization,
            Qualifications,
            YearsOfExperience,
            Department,
            RoomNumber,
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
            MedicalLicenseNumber,
            Specialization,
            Qualifications,
            YearsOfExperience,
            Department,
            RoomNumber,
            Email,
            Password: hashedPassword,

            // System Fields
            Role: "Doctor",
            Approve: false,
            InHospitalAvailability: false,
            StopAppointments: false,

            // Number of Appointments
            NoOfAppointments: 0
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
            return res.status(403).json({ message: "Your account has not been approved yet" });
        }

        // --- Change Availability to True --- //
        existingDoctor.InHospitalAvailability = true;
        existingDoctor.StopAppointments = false;
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

        // --- Change Availability to False and Stop StopAppointments to True --- //
        existingDoctor.InHospitalAvailability = false;
        existingDoctor.StopAppointments = true;
        await existingDoctor.save();

        res.status(200).json({ message: "Logout successful", existingDoctor });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 04. Get All Doctor Details //
//----------------------------//

exports.Get_All_Doctor_Details = async (req, res) => {
    try {
        const allDoctor = await doctor.find();

        if (allDoctor.length === 0) {
            return res.status(404).json({ message: "No Doctor Found" });
        }

        res.status(200).json({ message: "All Doctor Details Retrieved", allDoctor });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 05. Get Doctor Approve Status //
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


// 06. Get Doctor is In-Hospital Availability Status //
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


// 07. Get Doctor Stop Appointments Status //
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


// 08. Update Doctor stop Appoinment Status //
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


// 09. Get Doctor Details //
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


// 10. Delete Doctor //
//-------------------//

exports.Delete_Doctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { Password } = req.body;

        // --- Check if Doctor exists --- //
        const existingDoctor = await doctor.findById(doctorId);

        if (!existingDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // --- Validate Password --- //
        const isMatch = await bcrypt.compare(Password, existingDoctor.Password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // --- Delete Doctor --- //
        await existingDoctor.deleteOne();

        res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ------------------------ Update User ------------------------//

// 11. Update Phone Number //
//-------------------------//

exports.Update_Phone_Number = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { PhoneNumber } = req.body;

        // --- Check if Doctor exists --- //
        const existingDoctor = await doctor.findById(doctorId);

        if (!existingDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // --- Update Phone Number --- //
        existingDoctor.PhoneNumber = PhoneNumber;
        await existingDoctor.save();

        res.status(200).json({ message: "Doctor Phone Number Updated", existingDoctor });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 12. Update Password //
//---------------------//

exports.Update_Password = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { OldPassword, NewPassword } = req.body;

        // --- Check if Doctor exists --- //
        const existingDoctor = await doctor.findById(doctorId);

        if (!existingDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // --- Check Old Password --- //
        const isOldPasswordValid = await bcrypt.compare(OldPassword, existingDoctor.Password);

        if (!isOldPasswordValid) {
            return res.status(400).json({ message: "Invalid old password" });
        }

        // --- Password Validation --- //
        if (NewPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // --- Hash New Password --- //
        const hashedPassword = await bcrypt.hash(NewPassword, 10);

        // --- Update Password --- //
        existingDoctor.Password = hashedPassword;
        await existingDoctor.save();

        res.status(200).json({ message: "Doctor Password Updated", existingDoctor });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 13. Forgot Password //
//---------------------//

exports.Forgot_Password = async (req, res) => {
    try {
        const { Email, NICPassportNumber, NewPassword, OTP } = req.body;

        // --- Check if Doctor exists --- //
        const existingDoctor = await doctor.findOne({ Email });

        if (!existingDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // --- Check if NICPassportNumber matches existingDoctor --- //
        if (existingDoctor.NICPassportNumber !== NICPassportNumber) {
            return res.status(400).json({ message: "Invalid NIC/Passport Number" });
        }

        // --- Password Validation --- //

        if (NewPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // --- Check OTP === 000000 --- //

        if (OTP === "000000") {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // --- Hash New Password --- //
        const hashedPassword = await bcrypt.hash(NewPassword, 10);

        // --- Update Password --- //
        existingDoctor.Password = hashedPassword;
        await existingDoctor.save();

        res.status(200).json({ message: "Doctor Password Reset Successfully", existingDoctor });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};