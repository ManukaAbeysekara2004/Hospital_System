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

        // --- Check if Admin is approved --- //
        if (existingAdmin.Approve === false) {
            return res.status(403).json({ message: "Your account has not been approved yet" });
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
        const { Password } = req.body;

        // --- Check if Admin exists --- //
        const existingAdmin = await admin.findById(adminId);

        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // --- Validate Password --- //
        const isMatch = await bcrypt.compare(Password, existingAdmin.Password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // --- Delete Admin --- //

        await existingAdmin.deleteOne();

        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 06. Get All Admin Details //
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


// ------------------------ Update Approve Status ------------------------ //

// 07. Update Accountant Approve Status //
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

// 08. Update Admin Approve Status //
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

// 09. Update Doctor Approve Status //
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

// 10. Update Lab Staff Approve Status //
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

// 11. Update Nurse Approve Status //
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

// 12. Update Pharmacist Approve Status //
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

// 13. Update Receptionist Approve Status //
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

// 14. Get Bill Prices Details //
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


// 15. Update Appointment_Price //
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


// 16. Update Blood_Test_Price //
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


// 17. Update Urine_Test_Price //
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

// 18. Create Bill Price //
//-----------------------//

exports.Create_Bill_Price = async (req, res) => {
    try {
        const { Appointment_Price, Blood_Test_Price, Urine_Test_Price } = req.body;

        // --- Create Bill Price ---
        const New_billPrice = new billPrice({
            Appointment_Price,
            Blood_Test_Price,
            Urine_Test_Price
        });

        await New_billPrice.save();

        res.status(201).json({ message: "Bill Price Created", New_billPrice });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ------------------------ Update User ------------------------//

// 19. Update Phone Number //
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

// 20. Update Password //
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


// 21. Forgot Password //
//---------------------//

exports.Forgot_Password = async (req, res) => {
    try {
        const { email, NICNumber, NewPassword, OTP } = req.body;

        // --- Check if Admin exists --- //
        const existingAdmin = await admin.findOne({ email });

        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // --- Check if NICNumber matches existingAdmin --- //
        if (existingAdmin.NICNumber !== NICNumber) {
            return res.status(400).json({ message: "Invalid NIC Number" });
        }

        // --- Check if New Password is valid --- //
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
        existingAdmin.Password = hashedPassword;
        await existingAdmin.save();

        res.status(200).json({ message: "Admin Password Updated", existingAdmin });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}


// ------------------------ Delete User ------------------------//

// 22. Delete Accountant //
//-----------------------//

exports.Admin_Delete_Accountant = async (req, res) => {
    try {
        const { accountantId } = req.params;

        // --- Check if Accountant exists --- //
        const existingAccountant = await accountant.findById(accountantId);

        if (!existingAccountant) {
            return res.status(404).json({ message: "Accountant not found" });
        }

        // --- Delete Accountant --- //
        await accountant.findByIdAndDelete(accountantId);

        res.status(200).json({ message: "Accountant Deleted", existingAccountant });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 23. Delete Admin //
//------------------//

exports.Admin_Delete_Admin = async (req, res) => {
    try {
        const { adminId } = req.params;

        // --- Check if Admin exists --- //
        const existingAdmin = await admin.findById(adminId);

        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // --- Delete Admin --- //
        await admin.findByIdAndDelete(adminId);

        res.status(200).json({ message: "Admin Deleted", existingAdmin });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 24. Delete Doctor //
//-------------------//

exports.Admin_Delete_Doctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // --- Check if Doctor exists --- //
        const existingDoctor = await doctor.findById(doctorId);

        if (!existingDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // --- Delete Doctor --- //
        await doctor.findByIdAndDelete(doctorId);

        res.status(200).json({ message: "Doctor Deleted", existingDoctor });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 25. Delete Lab Staff //
//----------------------//

exports.Admin_Delete_Lab_Staff = async (req, res) => {
    try {
        const { labStaffId } = req.params;

        // --- Check if Lab Staff exists --- //
        const existingLabStaff = await laboratory_staff.findById(labStaffId);

        if (!existingLabStaff) {
            return res.status(404).json({ message: "Lab Staff not found" });
        }

        // --- Delete Lab Staff --- //
        await laboratory_staff.findByIdAndDelete(labStaffId);

        res.status(200).json({ message: "Lab Staff Deleted", existingLabStaff });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 26. Delete Nurse //
//------------------//

exports.Admin_Delete_Nurse = async (req, res) => {
    try {
        const { nurseId } = req.params;

        // --- Check if Nurse exists --- //
        const existingNurse = await nurse.findById(nurseId);

        if (!existingNurse) {
            return res.status(404).json({ message: "Nurse not found" });
        }

        // --- Delete Nurse --- //
        await nurse.findByIdAndDelete(nurseId);

        res.status(200).json({ message: "Nurse Deleted", existingNurse });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 27. Delete Pharmacist //
//-----------------------//

exports.Admin_Delete_Pharmacist = async (req, res) => {
    try {
        const { pharmacistId } = req.params;

        // --- Check if Pharmacist exists --- //
        const existingPharmacist = await pharmacist.findById(pharmacistId);

        if (!existingPharmacist) {
            return res.status(404).json({ message: "Pharmacist not found" });
        }

        // --- Delete Pharmacist --- //
        await pharmacist.findByIdAndDelete(pharmacistId);

        res.status(200).json({ message: "Pharmacist Deleted", existingPharmacist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 28. Delete Receptionist //
//------------------------//

exports.Admin_Delete_Receptionist = async (req, res) => {
    try {
        const { receptionistId } = req.params;

        // --- Check if Receptionist exists --- //
        const existingReceptionist = await receptionist.findById(receptionistId);

        if (!existingReceptionist) {
            return res.status(404).json({ message: "Receptionist not found" });
        }

        // --- Delete Receptionist --- //
        await receptionist.findByIdAndDelete(receptionistId);

        res.status(200).json({ message: "Receptionist Deleted", existingReceptionist });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};