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

// 01. Accountant Registration //
//-----------------------------//

exports.Accountant_Registration = async (req, res) => {
    try {

        const {
            FullName,
            DateOfBirth,
            Gender,
            NICNumber,
            PhoneNumber,
            Address,
            EmployeeID,
            Qualifications,
            JobPosition,
            Department,
            Email,
            Password
        } = req.body;

        
        // --- Check NIC already exists --- //
        
        const existingNIC = await accountant.findOne({ NICNumber });

        if (existingNIC) {
            return res.status(400).json({
                message: "NIC Number already registered"
            });
        }

        // --- Check Employee ID already exists --- //

        const existingEmployee = await accountant.findOne({ EmployeeID });

        if (existingEmployee) {
            return res.status(400).json({
                message: "Employee ID already exists"
            });
        }

        
        // --- Validate Phone Number, Must be exactly 10 digits --- //
        
        if (!/^\d{10}$/.test(PhoneNumber)) {
            return res.status(400).json({
                message: "Phone Number must contain exactly 10 digits"
            });
        }

        // --- Validate Email, Must end with @gmail.com --- //

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

        // --- Save Accountant --- //

        const newAccountant = new accountant({
            FullName,
            DateOfBirth,
            Gender,
            NICNumber,
            PhoneNumber,
            Address,
            EmployeeID,
            Qualifications,
            JobPosition,
            Department,
            Email,
            Password: hashedPassword,

            // System Fields
            Role: "Accountant",
            Approve: false
        });

        await newAccountant.save();

        res.status(201).json({
            message: "Accountant registered successfully",
            newAccountant
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};


// 02. Accountant Login //
//----------------------//

exports.Accountant_Login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // --- Check if Email exists --- //
        const existingAccountant = await accountant.findOne({ Email });

        if (!existingAccountant) {
            return res.status(404).json({ message: "Accountant not found" });
        }

        // --- Validate Password --- //
        const isMatch = await bcrypt.compare(Password, existingAccountant.Password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // --- Check Approve Status --- //
        if (existingAccountant.Approve === false) {
            return res.status(403).json({ message: "Your account has not been approved yet" });
        }

        res.status(200).json({ message: "Login successful", existingAccountant });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 03. Get All Accountant Details //
//--------------------------------//

exports.Get_All_Accountant_Details = async (req, res) => {
    try {
        const allAccountant = await accountant.find();

        if (allAccountant.length === 0) {
            return res.status(404).json({ message: "No Accountant Found" });
        }

        res.status(200).json({ message: "All Accountant Details Retrieved", allAccountant });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 04. Get Accountant Approve Status //
//-----------------------------------//

exports.Get_Approve_Status = async (req, res) => {
    try {
        const { accountantId } = req.params;

        // --- Check if Accountant exists --- //
        const existingAccountant = await accountant.findById(accountantId);

        if (!existingAccountant) {
            return res.status(404).json({ message: "Accountant not found" });
        }

        res.status(200).json({ message: "Approve status retrieved successfully", approve: existingAccountant.Approve });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 05. Get Accountant Details //
//----------------------------//

exports.Get_Accountant_Details = async (req, res) => {
    try {
        const { accountantId } = req.params;

        // --- Check if Accountant exists --- //
        const existingAccountant = await accountant.findById(accountantId);

        if (!existingAccountant) {
            return res.status(404).json({ message: "Accountant not found" });
        }

        res.status(200).json({ message: "Accountant details retrieved successfully", accountant: existingAccountant });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 06. Delete Accountant //
//-----------------------//

exports.Delete_Accountant = async (req, res) => {
    try {
        const { accountantId } = req.params;
        const { Password } = req.body;

        // --- Check if Accountant exists --- //
        const existingAccountant = await accountant.findById(accountantId);

        if (!existingAccountant) {
            return res.status(404).json({ message: "Accountant not found" });
        }

        // --- Validate Password --- //
        const isMatch = await bcrypt.compare(Password, existingAccountant.Password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // --- Delete Accountant --- //

        await existingAccountant.deleteOne();

        res.status(200).json({ message: "Accountant deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};  


// ------------------------ Update User ------------------------//

// 07. Update Contact Number //
//---------------------------//

exports.Update_Contact_Number = async (req, res) => {
    try {
        const { accountantId } = req.params;
        const { PhoneNumber } = req.body;

        // --- Check if Accountant exists --- //
        const existingAccountant = await accountant.findById(accountantId);

        if (!existingAccountant) {
            return res.status(404).json({ message: "Accountant not found" });
        }

        // --- Validate Phone Number, Must be exactly 10 digits --- //

        if (!/^\d{10}$/.test(PhoneNumber)) {
            return res.status(400).json({
                message: "Phone Number must contain exactly 10 digits"
            });
        }

        existingAccountant.PhoneNumber = PhoneNumber;
        await existingAccountant.save();

        res.status(200).json({ message: "Contact Number updated successfully", existingAccountant });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 08. Update Password //
//---------------------//

exports.Update_Password = async (req, res) => {
    try {
        const { accountantId } = req.params;
        const { OldPassword, NewPassword } = req.body;

        // --- Check if Accountant exists --- //
        const existingAccountant = await accountant.findById(accountantId);

        if (!existingAccountant) {
            return res.status(404).json({ message: "Accountant not found" });
        }

        // --- Check Old Password --- //

        const isOldPasswordValid = await bcrypt.compare(OldPassword, existingAccountant.Password);
        
        if (!isOldPasswordValid) {
            return res.status(400).json({ message: "Invalid old password" });
        }

        // --- Password Validation --- //

        if (NewPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // --- Hash Password --- //

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(NewPassword, salt);

        existingAccountant.Password = hashedPassword;
        await existingAccountant.save();

        res.status(200).json({ message: "Password updated successfully", existingAccountant });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 09. Forgot Password //
//---------------------//

exports.Forgot_Password = async (req, res) => {
    try {
        const { Email, NICNumber, NewPassword, OTP } = req.body;

        // --- Check if Accountant exists By email --- //
        const existingAccountant = await accountant.findOne({ Email });

        if (!existingAccountant) {
            return res.status(404).json({ message: "Accountant not found" });
        }

        // --- Check if NICNumber matches existingAccountant --- //
        if (existingAccountant.NICNumber !== NICNumber) {
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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(NewPassword, salt);

        existingAccountant.Password = hashedPassword;
        await existingAccountant.save();
        
        res.status(200).json({ message: "Password updated successfully", existingAccountant });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};