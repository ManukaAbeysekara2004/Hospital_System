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

// 01. Request for Blood Test //
//------------------------//

exports.request_Blood_Test = async (req, res) => {
    try {
        const { PatientID, DoctorID } = req.body;

        const RequestedBloodTest = await bloodTest.create({
            PatientID,
            DoctorID
        });

        res.status(200).json({ success: true, data: RequestedBloodTest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 02. Request for Urine Test //
//------------------------//

exports.request_Urine_Test = async (req, res) => {
    try {
        const { PatientID, DoctorID } = req.body;

        const RequestedUrineTest = await urineTest.create({
            PatientID,
            DoctorID
        });

        res.status(200).json({ success: true, data: RequestedUrineTest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 03. Get CompleteStatus False Blood Test //
//-----------------------------------------//

exports.get_Complete_Status_False_Blood_Test = async (req, res) => {
    try {
        const PendingBloodTest = await bloodTest.find({ CompleteStatus: false });

        // --- Get Patient FullName and PatientRegID By PatientID ---
        const PatientDetails = await patient.findById(PendingBloodTest.PatientID);

        // --- Get Doctor FullName and DoctorRegID By DoctorID ---
        const DoctorDetails = await doctor.findById(PendingBloodTest.DoctorID).select("FullName PhoneNumber");

        res.status(200).json({ success: true, data: { PendingBloodTest, PatientDetails, DoctorDetails } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 04. Get CompleteStatus False Urine Test //
//-----------------------------------------//

exports.get_Complete_Status_False_Urine_Test = async (req, res) => {
    try {
        const PendingUrineTest = await urineTest.find({ CompleteStatus: false });

        // --- Get Patient FullName and PatientRegID By PatientID ---
        const PatientDetails = await patient.findById(PendingUrineTest.PatientID);

        // --- Get Doctor FullName and DoctorRegID By DoctorID ---
        const DoctorDetails = await doctor.findById(PendingUrineTest.DoctorID).select("FullName PhoneNumber");

        res.status(200).json({ success: true, data: { PendingUrineTest, PatientDetails, DoctorDetails } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 05. Get CompleteStatus True Blood Test //
//----------------------------------------//

exports.get_Complete_Status_True_Blood_Test = async (req, res) => {
    try {
        const CompletedBloodTest = await bloodTest.find({ CompleteStatus: true });

        // --- Get Patient FullName and PatientRegID By PatientID ---
        const PatientDetails = await patient.findById(CompletedBloodTest.PatientID);

        // --- Get Doctor FullName and DoctorRegID By DoctorID ---
        const DoctorDetails = await doctor.findById(CompletedBloodTest.DoctorID).select("FullName PhoneNumber");

        res.status(200).json({ success: true, data: { CompletedBloodTest, PatientDetails, DoctorDetails } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 06. Get CompleteStatus True Urine Test //
//----------------------------------------//

exports.get_Complete_Status_True_Urine_Test = async (req, res) => {
    try {
        const CompletedUrineTest = await urineTest.find({ CompleteStatus: true });
        
        // --- Get Patient FullName and PatientRegID By PatientID ---
        const PatientDetails = await patient.findById(CompletedUrineTest.PatientID);

        // --- Get Doctor FullName and DoctorRegID By DoctorID ---
        const DoctorDetails = await doctor.findById(CompletedUrineTest.DoctorID).select("FullName PhoneNumber");

        res.status(200).json({ success: true, data: { CompletedUrineTest, PatientDetails, DoctorDetails } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 07. Fill Blood Test Form //
//--------------------------//

exports.fill_Blood_Test_Form = async (req, res) => {
    try {
        const { BloodTestID } = req.params;
        const { Hemoglobin, WBC, RBC, Platelets, BloodSugar, BloodGroup, Remarks, BillPricesID } = req.body;

        // --- Check Bill ID --- //
        const existingBillPrice = await billPrice.findById(BillPricesID);
        if (!existingBillPrice) {
            return res.status(404).json({
                message: "Bill not found"
            });
        }

        const Filled_Blood_Test = await bloodTest.findByIdAndUpdate(BloodTestID, {
            CompleteStatus: true,
            Hemoglobin,
            WBC,
            RBC,
            Platelets,
            BloodSugar,
            BloodGroup,
            Remarks,
            Fee: existingBillPrice.Blood_Test_Price
        }, { new: true });

        res.status(200).json({ success: true, data: Filled_Blood_Test });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 08. Fill Urine Test Form //
//--------------------------//

exports.fill_Urine_Test_Form = async (req, res) => {
    try {
        const { UrineTestID } = req.params;
        const { Color, Appearance, pH, SpecificGravity, Protein, Glucose, Remarks, BillPricesID } = req.body;

        // --- Check Bill ID --- //
        const existingBillPrice = await billPrice.findById(BillPricesID);
        if (!existingBillPrice) {
            return res.status(404).json({
                message: "Bill not found"
            });
        }

        const Filled_Urine_Test = await urineTest.findByIdAndUpdate(UrineTestID, {
            CompleteStatus: true,
            Color,
            Appearance,
            pH,
            SpecificGravity,
            Protein,
            Glucose,
            Remarks,
            Fee: existingBillPrice.Urine_Test_Price
        }, { new: true });

        res.status(200).json({ success: true, data: Filled_Urine_Test });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 09. Get Blood Test Details by Patient ID //
//------------------------------------------//

exports.get_Blood_Test_Details_By_PatientID = async (req, res) => {
    try {
        const { PatientID } = req.params;

        // --- Find Blood test By Patient ID --- //
        const Detailed_Blood_Test = await bloodTest.find({ PatientID });

        if (!Detailed_Blood_Test) {
            return res.status(404).json({ success: false, message: "Blood Test Not Found" });
        }

        // --- Get Patient Details --- //
        const PatientDetails = await patient.findById(PatientID);

        // --- Get Doctor Details --- //
        const DoctorDetails = await doctor.findById(Detailed_Blood_Test.DoctorID).select("FullName PhoneNumber");

        res.status(200).json({
            Detailed_Blood_Test,
            PatientDetails,
            DoctorDetails
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 10. Get Urine Test Details by Patient ID //
//------------------------------------------//

exports.get_Urine_Test_Details_By_PatientID = async (req, res) => {
    try {
        const { PatientID } = req.params;

        // --- Find Urine test By Patient ID --- //
        const Detailed_Urine_Test = await urineTest.find({ PatientID });

        if (!Detailed_Urine_Test) {
            return res.status(404).json({ success: false, message: "Urine Test Not Found" });
        }

        // --- Get Patient Details --- //
        const PatientDetails = await patient.findById(PatientID);

        // --- Get Doctor Details --- //
        const DoctorDetails = await doctor.findById(Detailed_Urine_Test.DoctorID).select("FullName PhoneNumber");

        res.status(200).json({
            Detailed_Urine_Test,
            PatientDetails,
            DoctorDetails
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}