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


// ------------------------ Admin Manage ------------------------//

// 06. Get All Accountant Details //
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

// 07. Get All Admin Details //
//---------------------------//

exports.Get_All_Admin_Details = async (req, res) => {
    try {
        const allAdmin = await admin.find();

        if (allAdmin.length === 0) {
            return res.status(404).json({ message: "No Admin Found" });
        }

        res.status(200).json({ message: "All Admin Details Retrieved", allAdmin });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 08. Get All Doctor Details //
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

// 09. Get All Lab Staff Details //
//-------------------------------//

exports.Get_All_Lab_Staff_Details = async (req, res) => {
    try {
        const allLabStaff = await laboratory_staff.find();

        if (allLabStaff.length === 0) {
            return res.status(404).json({ message: "No Lab Staff Found" });
        }

        res.status(200).json({ message: "All Lab Staff Details Retrieved", allLabStaff });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 10. Get All Nurse Details //
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

// 11. Get All Patient Details //
//-----------------------------//

exports.Get_All_Patient_Details = async (req, res) => {
    try {
        const allPatient = await patient.find();

        if (allPatient.length === 0) {
            return res.status(404).json({ message: "No Patient Found" });
        }

        res.status(200).json({ message: "All Patient Details Retrieved", allPatient });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 12. Get All Pharmacist Details //
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

// 13. Get All Receptionist Details //
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


// ----- Update Approve Status ----- //

// 14. Update Accountant Approve Status //
//--------------------------------------//

exports.Update_Accountant_Approve_Status = async (req, res) => {
    try {
        const { accountantId } = req.params;
        const { Approve } = req.body;

        // --- Check if Accountant exists --- //
        const existingAccountant = await accountant.findById(accountantId);

        if (!existingAccountant) {
            return res.status(404).json({ message: "Accountant not found" });
        }

        // --- Update Approve Status --- //
        existingAccountant.Approve = Approve;
        await existingAccountant.save();

        res.status(200).json({ message: "Accountant Approve Status Updated", existingAccountant });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 15. Update Admin Approve Status //
//---------------------------------//

exports.Update_Admin_Approve_Status = async (req, res) => {
    try {
        const { adminId } = req.params;
        const { Approve } = req.body;

        // --- Check if Admin exists --- //
        const existingAdmin = await admin.findById(adminId);

        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // --- Update Approve Status --- //
        existingAdmin.Approve = Approve;
        await existingAdmin.save();

        res.status(200).json({ message: "Admin Approve Status Updated", existingAdmin });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 16. Update Doctor Approve Status //
//---------------------------------//

exports.Update_Doctor_Approve_Status = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { Approve } = req.body;

        // --- Check if Doctor exists --- //
        const existingDoctor = await doctor.findById(doctorId);

        if (!existingDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // --- Update Approve Status --- //
        existingDoctor.Approve = Approve;
        await existingDoctor.save();

        res.status(200).json({ message: "Doctor Approve Status Updated", existingDoctor });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 17. Update Lab Staff Approve Status //
//-------------------------------------//

exports.Update_Lab_Staff_Approve_Status = async (req, res) => {
    try {
        const { labStaffId } = req.params;
        const { Approve } = req.body;

        // --- Check if Lab Staff exists --- //
        const existingLabStaff = await laboratory_staff.findById(labStaffId);

        if (!existingLabStaff) {
            return res.status(404).json({ message: "Lab Staff not found" });
        }

        // --- Update Approve Status --- //
        existingLabStaff.Approve = Approve;
        await existingLabStaff.save();

        res.status(200).json({ message: "Lab Staff Approve Status Updated", existingLabStaff });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 18. Update Nurse Approve Status //
//---------------------------------//

exports.Update_Nurse_Approve_Status = async (req, res) => {
    try {
        const { nurseId } = req.params;
        const { Approve } = req.body;

        // --- Check if Nurse exists --- //
        const existingNurse = await nurse.findById(nurseId);

        if (!existingNurse) {
            return res.status(404).json({ message: "Nurse not found" });
        }

        // --- Update Approve Status --- //
        existingNurse.Approve = Approve;
        await existingNurse.save();

        res.status(200).json({ message: "Nurse Approve Status Updated", existingNurse });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 19. Update Pharmacist Approve Status //
//--------------------------------------//

exports.Update_Pharmacist_Approve_Status = async (req, res) => {
    try {
        const { pharmacistId } = req.params;
        const { Approve } = req.body;

        // --- Check if Pharmacist exists --- //
        const existingPharmacist = await pharmacist.findById(pharmacistId);

        if (!existingPharmacist) {
            return res.status(404).json({ message: "Pharmacist not found" });
        }

        // --- Update Approve Status --- //
        existingPharmacist.Approve = Approve;
        await existingPharmacist.save();

        res.status(200).json({ message: "Pharmacist Approve Status Updated", existingPharmacist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 20. Update Receptionist Approve Status //
//--------------------------------------//

exports.Update_Receptionist_Approve_Status = async (req, res) => {
    try {
        const { receptionistId } = req.params;
        const { Approve } = req.body;

        // --- Check if Receptionist exists --- //
        const existingReceptionist = await receptionist.findById(receptionistId);

        if (!existingReceptionist) {
            return res.status(404).json({ message: "Receptionist not found" });
        }

        // --- Update Approve Status --- //
        existingReceptionist.Approve = Approve;
        await existingReceptionist.save();

        res.status(200).json({ message: "Receptionist Approve Status Updated", existingReceptionist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// ------------------------ Bill Manage ------------------------//

// 21. Get Bill Prices Details //
//-----------------------------//

exports.Get_All_Bill_Prices_Details = async (req, res) => {
    try {
        const allBillPrices = await billPrice.find();

        if (allBillPrices.length === 0) {
            return res.status(404).json({ message: "No Bill Prices Found" });
        }

        res.status(200).json({ message: "All Bill Prices Details Retrieved", allBillPrices });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 22. Update Appointment_Price //
//------------------------------//

exports.Update_Appointment_Price = async (req, res) => {
    try {
        const { billPriceId } = req.params;
        const { Appointment_Price } = req.body;

        // --- Check if Bill Price exists --- //
        const existingBillPrice = await billPrice.findById(billPriceId);

        if (!existingBillPrice) {
            return res.status(404).json({ message: "Bill Price not found" });
        }

        // --- Update Bill Price --- //
        existingBillPrice.Appointment_Price = Appointment_Price;
        await existingBillPrice.save();

        res.status(200).json({ message: "Bill Price Updated", existingBillPrice });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 23. Update Blood_Test_Price //
//-----------------------------//

exports.Update_Blood_Test_Price = async (req, res) => {
    try {
        const { billPriceId } = req.params;
        const { Blood_Test_Price } = req.body;

        // --- Check if Bill Price exists --- //
        const existingBillPrice = await billPrice.findById(billPriceId);

        if (!existingBillPrice) {
            return res.status(404).json({ message: "Bill Price not found" });
        }

        // --- Update Bill Price --- //
        existingBillPrice.Blood_Test_Price = Blood_Test_Price;
        await existingBillPrice.save();

        res.status(200).json({ message: "Bill Price Updated", existingBillPrice });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 24. Update Urine_Test_Price //
//-----------------------------//

exports.Update_Urine_Test_Price = async (req, res) => {
    try {
        const { billPriceId } = req.params;
        const { Urine_Test_Price } = req.body;

        // --- Check if Bill Price exists --- //
        const existingBillPrice = await billPrice.findById(billPriceId);

        if (!existingBillPrice) {
            return res.status(404).json({ message: "Bill Price not found" });
        }

        // --- Update Bill Price --- //
        existingBillPrice.Urine_Test_Price = Urine_Test_Price;
        await existingBillPrice.save();

        res.status(200).json({ message: "Bill Price Updated", existingBillPrice });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ------------------------ Update User ------------------------//

// 25. Update Phone Number //
//-------------------------//

exports.Update_Phone_Number = async (req, res) => {
    try {
        const { adminId } = req.params;
        const { PhoneNumber } = req.body;

        // --- Check if Admin exists --- //
        const existingAdmin = await admin.findById(adminId);

        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // --- Update Phone Number --- //
        existingAdmin.PhoneNumber = PhoneNumber;
        await existingAdmin.save();

        res.status(200).json({ message: "Admin Phone Number Updated", existingAdmin });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 26. Update Password //
//---------------------//

exports.Update_Password = async (req, res) => {
    try {
        const { adminId } = req.params;
        const { OldPassword, NewPassword } = req.body;

        // --- Check if Admin exists --- //
        const existingAdmin = await admin.findById(adminId);

        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // --- Check Old Password --- //
        const isOldPasswordValid = await bcrypt.compare(OldPassword, existingAdmin.Password);

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
        existingAdmin.Password = hashedPassword;
        await existingAdmin.save();

        res.status(200).json({ message: "Admin Password Updated", existingAdmin });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};