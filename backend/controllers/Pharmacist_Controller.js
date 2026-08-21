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

        // --- Check Approve Status --- //
        if (existingPharmacist.Approve === false) {
            return res.status(403).json({ message: "Your account has not been approved yet" });
        }

        res.status(200).json({ message: "Login successful", existingPharmacist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 03. Get All Pharmacist Details //
//--------------------------------//

exports.Get_All_Pharmacist_Details = async (req, res) => {
    try {
        const allPharmacist = await pharmacist.find();

        if (allPharmacist.length === 0) {
            return res.status(404).json({ message: "No Pharmacist Found" });
        }

        res.status(200).json({ message: "All Pharmacist Details Retrieved", allPharmacist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 04. Get Pharmacist Approve Status //
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


// 05. Get pharmacist details //
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


// 06. Delete Pharmacist //
//-----------------------//

exports.Delete_Pharmacist = async (req, res) => {
    try {
        const { pharmacistId } = req.params;
        const { Password } = req.body;

        // --- Check if Pharmacist exists --- //
        const existingPharmacist = await pharmacist.findById(pharmacistId);

        if (!existingPharmacist) {
            return res.status(404).json({ message: "Pharmacist not found" });
        }

        // --- Validate Password -- //
        const isMatch = await bcrypt.compare(Password, existingPharmacist.Password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // --- Delete Pharmacist -- //
        await existingPharmacist.deleteOne();

        res.status(200).json({ message: "Pharmacist deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// ------------------------ Update User ------------------------//

// 07. Update phone Number //
//-------------------------//

exports.Update_Phone_Number = async (req, res) => {
    try {
        const { pharmacistId } = req.params;
        const { PhoneNumber } = req.body;

        // --- Check if Pharmacist exists --- //
        const existingPharmacist = await pharmacist.findById(pharmacistId);

        if (!existingPharmacist) {
            return res.status(404).json({ message: "Pharmacist not found" });
        }

        // --- Validate Phone Number --- //
        if (!PhoneNumber) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        if (!/^\d{10}$/.test(PhoneNumber)) {
            return res.status(400).json({ message: "Phone Number must contain exactly 10 digits" });
        }

        // --- Update Phone Number --- //
        existingPharmacist.PhoneNumber = PhoneNumber;
        await existingPharmacist.save();

        res.status(200).json({ message: "Pharmacist phone number updated", pharmacistDetails: existingPharmacist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 08. Update Password //
//---------------------//

exports.Update_Password = async (req, res) => {
    try {
        const { pharmacistId } = req.params;
        const { OldPassword, NewPassword } = req.body;

        // --- Check if Pharmacist exists --- //
        const existingPharmacist = await pharmacist.findById(pharmacistId);

        if (!existingPharmacist) {
            return res.status(404).json({ message: "Pharmacist not found" });
        }

        // --- Validate Old Password --- //
        const isOldPasswordValid = await bcrypt.compare(OldPassword, existingPharmacist.Password);

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
        existingPharmacist.Password = hashedPassword;
        await existingPharmacist.save();

        res.status(200).json({ message: "Pharmacist password updated", pharmacistDetails: existingPharmacist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 09. Forgot Password //
//---------------------//

exports.Forgot_Password = async (req, res) => {
    try {
        const { Email, NICNumber, NewPassword, OTP } = req.body;

        // --- Check if Pharmacist exists By email --- //
        const existingPharmacist = await pharmacist.findOne({ Email });

        if (!existingPharmacist) {
            return res.status(404).json({ message: "Pharmacist not found" });
        }

        // --- Check if NICNumber matches existingPharmacist --- //
        if (existingPharmacist.NICNumber !== NICNumber) {
            return res.status(400).json({ message: "Invalid NIC Number" });
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

        // --- Hash Password And Save --- //
        const hashedPassword = await bcrypt.hash(NewPassword, 10);

        existingPharmacist.Password = hashedPassword;
        await existingPharmacist.save();

        res.status(200).json({ message: "Pharmacist Password Updated", existingPharmacist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};