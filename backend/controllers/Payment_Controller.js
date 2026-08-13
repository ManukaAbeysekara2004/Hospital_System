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

// 01. Create Payment Only Passing Pation ID //
//-------------------------------------------//

exports.create_Payment = async (req, res) => {
    try {
        const { PatientID } = req.body;

        // --- Check Patient Is exist --- //
        const isPatientExist = await patient.findById(PatientID);
        if (!isPatientExist) {
            return res.status(404).json({ success: false, error: 'Patient Not Found' });
        }

        // --- Check Payment Already Exist --- //
        const isPaymentExist = await payment.findOne({ PatientID });
        if (isPaymentExist) {
            return res.status(400).json({ success: false, error: 'Payment Already Exist' });
        }

        const payment = new payment({
            PatientID,
        });
        await payment.save();
        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// 02. Add Appointment Fee To Payment Model //
//------------------------------------------//

exports.add_Appointment_Fee = async (req, res) => {
    try {
        const { AppointmentID, PatientID } = req.params;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findOne({ PatientID });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Appointment Is Exist --- //
        const isAppointmentExist = await appointment.findById(AppointmentID);
        if (!isAppointmentExist) {
            return res.status(404).json({ success: false, error: 'Appointment Not Found' });
        }

        // --- Check isAppointmentExist Is Exist By Patient ID --- //
        if (isAppointmentExist.PatientID !== PatientID) {
            return res.status(404).json({ success: false, error: 'Appointment Not Found By Patient ID' });
        }

        // --- Check PaidStatus Is False in isAppointmentExist --- //
        if (isAppointmentExist.PaidStatus) {
            return res.status(400).json({ success: false, error: 'Appointment Fee Already Paid' });
        }

        // --- Add Appointment Fee --- //
        isPaymentExist.Appoinment_Fee.push({ AppointmentID, Appoinment_Fee: isAppointmentExist.Fee });

        await isPaymentExist.save();

        res.status(201).json({ success: true, data: isPaymentExist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// 03. Update Appointment PaidStatus to True and Add Appointment Fee To Full_Payment //
//-----------------------------------------------------------------------------------//

exports.update_Appointment_PaidStatus_And_Full_Payment = async (req, res) => {
    try {
        const { AppointmentID, PatientID } = req.params;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findOne({ PatientID });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Appointment Is Exist --- //
        const isAppointmentExist = await appointment.findById(AppointmentID);
        if (!isAppointmentExist) {
            return res.status(404).json({ success: false, error: 'Appointment Not Found' });
        }

        // --- Check isAppointmentExist Is Exist By Patient ID --- //
        if (isAppointmentExist.PatientID !== PatientID) {
            return res.status(404).json({ success: false, error: 'Appointment Not Found By Patient ID' });
        }

        // --- Check PaidStatus Is True in isAppointmentExist --- //
        if (isAppointmentExist.PaidStatus) {
            return res.status(400).json({ success: false, error: 'Appointment Fee Already Paid' });
        }

        // --- Update Appointment PaidStatus --- //
        isAppointmentExist.PaidStatus = true;

        // --- Update Full_Payment --- //  
        isPaymentExist.Full_Payment += isAppointmentExist.Fee;

        await isAppointmentExist.save();
        await isPaymentExist.save();

        res.status(200).json({ success: true, data: isAppointmentExist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// 04. Add Blood_test_Fee To Payment Model //
//-----------------------------------------//

exports.add_Blood_test_Fee = async (req, res) => {
    try {
        const { BloodTestID, PatientID } = req.params;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findOne({ PatientID });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Blood Test Is Exist --- //
        const isBloodTestExist = await bloodTest.findById(BloodTestID);
        if (!isBloodTestExist) {
            return res.status(404).json({ success: false, error: 'Blood Test Not Found' });
        }

        // --- Check isBloodTestExist Is Exist By Patient ID --- //
        if (isBloodTestExist.PatientID !== PatientID) {
            return res.status(404).json({ success: false, error: 'Blood Test Not Found By Patient ID' });
        }

        // --- Check PaidStatus Is False in isBloodTestExist --- //
        if (isBloodTestExist.PaidStatus) {
            return res.status(400).json({ success: false, error: 'Blood Test Fee Already Paid' });
        }

        // Add Blood Test Fee
        isPaymentExist.Blood_test_Fee.push({ BloodTestID, BloodTestFee: isBloodTestExist.Fee });

        await isPaymentExist.save();

        res.status(201).json({ success: true, data: isPaymentExist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// 05. Update BloodTest PaidStatus to True and Add Blood Test Fee To Full_Payment //
//--------------------------------------------------------------------------------//

exports.update_BloodTest_PaidStatus_And_Full_Payment = async (req, res) => {
    try {
        const { BloodTestID, PatientID } = req.params;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findOne({ PatientID });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Blood Test Is Exist --- //
        const isBloodTestExist = await bloodTest.findById(BloodTestID);
        if (!isBloodTestExist) {
            return res.status(404).json({ success: false, error: 'Blood Test Not Found' });
        }

        // --- Check isBloodTestExist Is Exist By Patient ID --- //
        if (isBloodTestExist.PatientID !== PatientID) {
            return res.status(404).json({ success: false, error: 'Blood Test Not Found By Patient ID' });
        }

        // --- Check PaidStatus Is True in isBloodTestExist --- //
        if (isBloodTestExist.PaidStatus) {
            return res.status(400).json({ success: false, error: 'Blood Test Fee Already Paid' });
        }

        // Update Blood Test PaidStatus
        isBloodTestExist.PaidStatus = true;

        // Update Full_Payment
        isPaymentExist.Full_Payment += isBloodTestExist.Fee;

        await isBloodTestExist.save();
        await isPaymentExist.save();

        res.status(200).json({ success: true, data: isBloodTestExist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// 06. Add Urine_test_Fee To Payment Model //
//-----------------------------------------//

exports.add_Urine_test_Fee = async (req, res) => {
    try {
        const { UrineTestID, PatientID } = req.params;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findOne({ PatientID });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Urine Test Is Exist --- //
        const isUrineTestExist = await urineTest.findById(UrineTestID);
        if (!isUrineTestExist) {
            return res.status(404).json({ success: false, error: 'Urine Test Not Found' });
        }

        // --- Check isUrineTestExist Is Exist By Patient ID --- //
        if (isUrineTestExist.PatientID !== PatientID) {
            return res.status(404).json({ success: false, error: 'isUrineTestExist Urine Test Not Found By Patient ID' });
        }

        // --- Check PaidStatus Is False in isUrineTestExist --- //
        if (isUrineTestExist.PaidStatus) {
            return res.status(400).json({ success: false, error: 'Urine Test Fee Already Paid' });
        }

        // Add Urine Test Fee
        isPaymentExist.Urine_test_Fee.push({ UrineTestID, UrineTestFee: isUrineTestExist.Fee });

        await isPaymentExist.save();

        res.status(201).json({ success: true, data: isPaymentExist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// 07. Update UrineTest PaidStatus to True and Add Urine Test Fee To Full_Payment //
//--------------------------------------------------------------------------------//

exports.update_UrineTest_PaidStatus_And_Full_Payment = async (req, res) => {
    try {
        const { UrineTestID, PatientID } = req.params;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findOne({ PatientID });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Urine Test Is Exist --- //
        const isUrineTestExist = await urineTest.findById(UrineTestID);
        if (!isUrineTestExist) {
            return res.status(404).json({ success: false, error: 'Urine Test Not Found' });
        }

        // --- Check isUrineTestExist Is Exist By Patient ID --- //
        if (isUrineTestExist.PatientID !== PatientID) {
            return res.status(404).json({ success: false, error: 'isUrineTestExist Urine Test Not Found By Patient ID' });
        }

        // --- Check PaidStatus Is True in isUrineTestExist --- //
        if (isUrineTestExist.PaidStatus) {
            return res.status(400).json({ success: false, error: 'Urine Test Fee Already Paid' });
        }

        // Update Urine Test PaidStatus
        isUrineTestExist.PaidStatus = true;

        // Update Full_Payment
        isPaymentExist.Full_Payment += isUrineTestExist.Fee;

        await isUrineTestExist.save();
        await isPaymentExist.save();

        res.status(200).json({ success: true, data: isUrineTestExist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// 08. Add Medicine_Fee To Payment Model //
//---------------------------------------//

exports.add_Medicine_Fee = async (req, res) => {
    try {
        const { MedicineBillID, PatientID } = req.params;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findOne({ PatientID });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Medicine Is Exist --- //
        const isMedicineExist = await medicine.findById(MedicineBillID);
        if (!isMedicineExist) {
            return res.status(404).json({ success: false, error: 'Medicine Not Found' });
        }

        // --- Check isMedicineExist Is Exist By Patient ID --- //
        if (isMedicineExist.PatientID !== PatientID) {
            return res.status(404).json({ success: false, error: 'Medicine Not Found By Patient ID' });
        }

        // --- Check PaidStatus Is False in isMedicineExist --- //
        if (isMedicineExist.PaidStatus) {
            return res.status(400).json({ success: false, error: 'Medicine Fee Already Paid' });
        }

        // --- Check CompleteStatus is True --- //
        if (!isMedicineExist.CompleteStatus) {
            return res.status(400).json({ success: false, error: 'Medicine Not Completed Yet' });
        }

        // Add Medicine Fee
        isPaymentExist.Medicine_Fee.push({ MedicineBillID, MedicineBillPrice: isMedicineExist.Total_Bill });

        await isPaymentExist.save();

        res.status(201).json({ success: true, data: isPaymentExist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// 09. Update Medicine PaidStatus to True and Add Medicine Fee To Full_Payment //
//-----------------------------------------------------------------------------//

exports.update_Medicine_PaidStatus_And_Full_Payment = async (req, res) => {
    try {
        const { MedicineBillID, PatientID } = req.params;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findOne({ PatientID });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Medicine Is Exist --- //
        const isMedicineExist = await medicine.findById(MedicineBillID);
        if (!isMedicineExist) {
            return res.status(404).json({ success: false, error: 'Medicine Not Found' });
        }

        // --- Check isMedicineExist Is Exist By Patient ID --- //
        if (isMedicineExist.PatientID !== PatientID) {
            return res.status(404).json({ success: false, error: 'Medicine Not Found By Patient ID' });
        }

        // --- Check PaidStatus Is True in isMedicineExist --- //
        if (isMedicineExist.PaidStatus) {
            return res.status(400).json({ success: false, error: 'Medicine Fee Already Paid' });
        }

        // --- Check CompleteStatus is True --- //
        if (!isMedicineExist.CompleteStatus) {
            return res.status(400).json({ success: false, error: 'Medicine Not Completed Yet' });
        }

        // Update Medicine PaidStatus
        isMedicineExist.PaidStatus = true;

        // Update Full_Payment
        isPaymentExist.Full_Payment += isMedicineExist.Total_Bill;

        await isMedicineExist.save();
        await isPaymentExist.save();

        res.status(200).json({ success: true, data: isMedicineExist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// 10. Update CompleteStatus on Payment //
//--------------------------------------//

exports.update_CompleteStatus = async (req, res) => {
    try {
        const { PaymentID } = req.params;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findById(PaymentID);
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // Update CompleteStatus
        isPaymentExist.CompleteStatus = true;

        await isPaymentExist.save();

        res.status(200).json({ success: true, data: isPaymentExist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// 11. Get Complete_Full_Payment True All Payments //
//-------------------------------------------------//

exports.get_Complete_Full_Payments = async (req, res) => {
    try {

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.find({ Complete_Full_Payment: true });

        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Get patient FullName and PatientRegID --- //
        const PatientDetails = await patient.findById(isPaymentExist.PatientID).select("FullName PatientRegID");

        res.status(200).json({ success: true, data: { isPaymentExist, PatientDetails } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// 12. Get Complete_Full_Payment False All Payments //
//--------------------------------------------------//

exports.get_Not_Complete_Full_Payments = async (req, res) => {
    try {

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.find({ Complete_Full_Payment: false });

        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Get patient FullName and PatientRegID --- //
        const PatientDetails = await patient.findById(isPaymentExist.PatientID).select("FullName PatientRegID");

        res.status(200).json({ success: true, data: { isPaymentExist, PatientDetails } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// 13. Get Payment By Patient ID //
//-------------------------------//

exports.get_Payment_Details_By_patientID = async (req, res) => {
    try {

        const { PatientID } = req.params;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findOne({ PatientID });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Get patient FullName and PatientRegID --- //
        const PatientDetails = await patient.findById(isPaymentExist.PatientID).select("FullName PatientRegID");

        res.status(200).json({ success: true, data: { isPaymentExist, PatientDetails } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};