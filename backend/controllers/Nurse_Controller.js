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

// 01. Nurse Registration //
//------------------------//

exports.Nurse_Registration = async (req, res) => {
    try {

        const {
            FullName,
            DateOfBirth,
            Gender,
            NICNumber,
            PhoneNumber,
            Address,
            NursingLicenseNumber,
            Qualifications,
            AssignedWard,
            Designation,
            EmployeeID,
            Email,
            Password
        } = req.body;

        // --- Check NIC Number --- //

        const existingNIC = await nurse.findOne({ NICNumber });

        if (existingNIC) {
            return res.status(400).json({
                message: "NIC Number already registered"
            });
        }

        // --- Check Nursing License Number --- //

        const existingLicense = await nurse.findOne({
            NursingLicenseNumber
        });

        if (existingLicense) {
            return res.status(400).json({
                message: "Nursing License Number already exists"
            });
        }

        // --- Check Employee ID --- //

        const existingEmployeeID = await nurse.findOne({
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

        // --- Save Nurse --- //

        const newNurse = new nurse({
            FullName,
            DateOfBirth,
            Gender,
            NICNumber,
            PhoneNumber,
            Address,
            NursingLicenseNumber,
            Qualifications,
            AssignedWard,
            Designation,
            EmployeeID,
            Email,
            Password: hashedPassword,

            // System Fields
            Role: "Nurse",
            Approve: false,
            InHospitalAvailability: false,
            InWork: false
        });

        await newNurse.save();

        res.status(201).json({
            message: "Nurse registered successfully",
            newNurse
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};


// 02. Nurse Login //
//-----------------//

exports.Nurse_Login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // --- Check if Nurse exists --- //
        const existingNurse = await nurse.findOne({ Email });

        if (!existingNurse) {
            return res.status(404).json({ message: "Nurse not found" });
        }

        // --- validate password --- //
        const isMatch = await bcrypt.compare(Password, existingNurse.Password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // --- Check Approve Status --- //
        if (existingNurse.Approve === false) {
            return res.status(403).json({ message: "Your account has not been approved yet" });
        }

        // --- Update Nurse Status to In Hospital Availability ---
        existingNurse.InHospitalAvailability = true;
        await existingNurse.save();

        res.status(200).json({ message: "Login successful", existingNurse });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 03. Nurse Logout //
//------------------//

exports.Nurse_Logout = async (req, res) => {
    try {
        const { nurseId } = req.params;

        // --- Check if Nurse exists --- //
        const existingNurse = await nurse.findById(nurseId);

        if (!existingNurse) {
            return res.status(404).json({ message: "Nurse not found" });
        }

        // --- Change Availability to False --- //
        existingNurse.InHospitalAvailability = false;
        await existingNurse.save();

        res.status(200).json({ message: "Logout successful", existingNurse });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 04. Get All Nurse Details //
//---------------------------//

exports.Get_All_Nurse_Details = async (req, res) => {
    try {
        const allNurse = await nurse.find();

        if (allNurse.length === 0) {
            return res.status(404).json({ message: "No Nurse Found" });
        }

        res.status(200).json({ message: "All Nurse Details Retrieved", allNurse });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 05. Get Nurse Approve Status //
//------------------------------//

exports.Get_Nurse_Approve_Status = async (req, res) => {
    try {
        const { nurseId } = req.params;

        // --- Check if Nurse exists --- //
        const existingNurse = await nurse.findById(nurseId);

        if (!existingNurse) {
            return res.status(404).json({ message: "Nurse not found" });
        }

        res.status(200).json({ message: "Nurse approve status retrieved", approveStatus: existingNurse.Approve });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 06. Get Is Nurse In Hospital Availability Status //
//--------------------------------------------------//

exports.Get_Nurse_InHospital_Availability_Status = async (req, res) => {
    try {
        const { nurseId } = req.params;

        // --- Check if Nurse exists --- //
        const existingNurse = await nurse.findById(nurseId);

        if (!existingNurse) {
            return res.status(404).json({ message: "Nurse not found" });
        }

        res.status(200).json({ message: "Nurse in-hospital availability status retrieved", inHospitalAvailabilityStatus: existingNurse.InHospitalAvailability });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 07. Get Is Nurse In Work Status //
//---------------------------------//

exports.Get_Nurse_InWork_Status = async (req, res) => {
    try {
        const { nurseId } = req.params;

        // --- Check if Nurse exists --- //
        const existingNurse = await nurse.findById(nurseId);

        if (!existingNurse) {
            return res.status(404).json({ message: "Nurse not found" });
        }

        res.status(200).json({ message: "Nurse in-work status retrieved", inWorkStatus: existingNurse.InWork });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 08. Get Nurse Details //
//-----------------------//

exports.Get_Nurse_Details = async (req, res) => {
    try {
        const { nurseId } = req.params;

        // --- Check if Nurse exists --- //
        const existingNurse = await nurse.findById(nurseId);

        if (!existingNurse) {
            return res.status(404).json({ message: "Nurse not found" });
        }

        res.status(200).json({ message: "Nurse details retrieved", nurseDetails: existingNurse });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 09. Delete Nurse //
//------------------//

exports.Delete_Nurse = async (req, res) => {
    try {
        const { nurseId, Password } = req.params;

        // --- Check if Nurse exists --- //
        const existingNurse = await nurse.findById(nurseId);

        if (!existingNurse) {
            return res.status(404).json({ message: "Nurse not found" });
        }

        // --- Validate Password --- //
        const isMatch = await bcrypt.compare(Password, existingNurse.Password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // --- Delete Nurse --- //

        await existingNurse.deleteOne();

        res.status(200).json({ message: "Nurse deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};      

// ------------------------ Update User ------------------------//

// 10. Update Phone Number //
//-------------------------//

exports.Update_Phone_Number = async (req, res) => {
    try {
        const { nurseId } = req.params;
        const { PhoneNumber } = req.body;

        // --- Check if Nurse exists --- //
        const existingNurse = await nurse.findById(nurseId);

        if (!existingNurse) {
            return res.status(404).json({ message: "Nurse not found" });
        }

        // --- Validate Phone Number --- //
        if (!PhoneNumber) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        // --- Update Phone Number --- //
        existingNurse.PhoneNumber = PhoneNumber;
        await existingNurse.save();

        res.status(200).json({ message: "Nurse phone number updated", nurseDetails: existingNurse });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 11. Update Password //
//---------------------//

exports.Update_Password = async (req, res) => {
    try {
        const { nurseId } = req.params;
        const { OldPassword, NewPassword } = req.body;

        // --- Check if Nurse exists --- //
        const existingNurse = await nurse.findById(nurseId);

        if (!existingNurse) {
            return res.status(404).json({ message: "Nurse not found" });
        }

        // --- Validate Old Password --- //
        const isOldPasswordValid = await bcrypt.compare(OldPassword, existingNurse.Password);

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
        existingNurse.Password = hashedPassword;
        await existingNurse.save();

        res.status(200).json({ message: "Nurse password updated", nurseDetails: existingNurse });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};