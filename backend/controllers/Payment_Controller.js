const mongoose = require('mongoose');
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

        // --- Check Active (Uncompleted) Payment Already Exist --- //
        const isPaymentExist = await payment.findOne({ PatientID, Complete_Full_Payment: false });
        if (isPaymentExist) {
            return res.status(200).json({ success: true, data: isPaymentExist, message: 'Active Payment Already Exist' });
        }

        const newPayment = new payment({
            PatientID,
        });
        await newPayment.save();
        res.status(201).json({ success: true, data: newPayment });
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
        const isPaymentExist = await payment.findOne({ PatientID, Complete_Full_Payment: false });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Appointment Is Exist --- //
        const isAppointmentExist = await appointment.findById(AppointmentID);
        if (!isAppointmentExist) {
            return res.status(404).json({ success: false, error: 'Appointment Not Found' });
        }

        // --- Check isAppointmentExist Is Exist By Patient ID --- //
        if (String(isAppointmentExist.PatientID) !== String(PatientID)) {
            return res.status(404).json({ success: false, error: 'Appointment Not Found By Patient ID' });
        }

        // --- Check PaidStatus Is False in isAppointmentExist --- //
        if (isAppointmentExist.PaidStatus) {
            return res.status(400).json({ success: false, error: 'Appointment Fee Already Paid' });
        }

        // --- Add Appointment Fee --- //
        isPaymentExist.Appoinment_Fee.push({
            AppointmentID: isAppointmentExist._id,
            BillName: 'Appointment Fee',
            Appoinment_Fee: isAppointmentExist.Fee
        });

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
        const isPaymentExist = await payment.findOne({ PatientID, Complete_Full_Payment: false });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Appointment Is Exist --- //
        const isAppointmentExist = await appointment.findById(AppointmentID);
        if (!isAppointmentExist) {
            return res.status(404).json({ success: false, error: 'Appointment Not Found' });
        }

        // --- Check isAppointmentExist Is Exist By Patient ID --- //
        if (String(isAppointmentExist.PatientID) !== String(PatientID)) {
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

        // --- Update Done in Appoinment_Fee --- //
        const apptFeeItem = isPaymentExist.Appoinment_Fee.find(item => String(item.AppointmentID) === String(isAppointmentExist._id));
        if (apptFeeItem) {
            apptFeeItem.Done = true;
        } else {
            isPaymentExist.Appoinment_Fee.push({
                AppointmentID: isAppointmentExist._id,
                BillName: 'Appointment Fee',
                Appoinment_Fee: isAppointmentExist.Fee,
                Done: true
            });
        }

        await isAppointmentExist.save();
        await isPaymentExist.save();

        res.status(200).json({ success: true, data: isPaymentExist });
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
        const isPaymentExist = await payment.findOne({ PatientID, Complete_Full_Payment: false });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Blood Test Is Exist --- //
        const isBloodTestExist = await bloodTest.findById(BloodTestID);
        if (!isBloodTestExist) {
            return res.status(404).json({ success: false, error: 'Blood Test Not Found' });
        }

        // --- Check isBloodTestExist Is Exist By Patient ID --- //
        if (String(isBloodTestExist.PatientID) !== String(PatientID)) {
            return res.status(404).json({ success: false, error: 'Blood Test Not Found By Patient ID' });
        }

        // --- Check PaidStatus Is False in isBloodTestExist --- //
        if (isBloodTestExist.PaidStatus) {
            return res.status(400).json({ success: false, error: 'Blood Test Fee Already Paid' });
        }

        // Add Blood Test Fee
        isPaymentExist.Blood_test_Fee.push({ 
            BloodTestID: isBloodTestExist._id, 
            BillName: 'Blood Test',
            BloodTestFee: isBloodTestExist.Fee 
        });

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
        const isPaymentExist = await payment.findOne({ PatientID, Complete_Full_Payment: false });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Blood Test Is Exist --- //
        const isBloodTestExist = await bloodTest.findById(BloodTestID);
        if (!isBloodTestExist) {
            return res.status(404).json({ success: false, error: 'Blood Test Not Found' });
        }

        // --- Check isBloodTestExist Is Exist By Patient ID --- //
        if (String(isBloodTestExist.PatientID) !== String(PatientID)) {
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

        // --- Update Done in Blood_test_Fee --- //
        const bloodFeeItem = isPaymentExist.Blood_test_Fee.find(item => String(item.BloodTestID) === String(isBloodTestExist._id));
        if (bloodFeeItem) {
            bloodFeeItem.Done = true;
        } else {
            isPaymentExist.Blood_test_Fee.push({
                BloodTestID: isBloodTestExist._id,
                BillName: 'Blood Test',
                BloodTestFee: isBloodTestExist.Fee,
                Done: true
            });
        }

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
        const isPaymentExist = await payment.findOne({ PatientID, Complete_Full_Payment: false });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Urine Test Is Exist --- //
        const isUrineTestExist = await urineTest.findById(UrineTestID);
        if (!isUrineTestExist) {
            return res.status(404).json({ success: false, error: 'Urine Test Not Found' });
        }

        // --- Check isUrineTestExist Is Exist By Patient ID --- //
        if (String(isUrineTestExist.PatientID) !== String(PatientID)) {
            return res.status(404).json({ success: false, error: 'isUrineTestExist Urine Test Not Found By Patient ID' });
        }

        // --- Check PaidStatus Is False in isUrineTestExist --- //
        if (isUrineTestExist.PaidStatus) {
            return res.status(400).json({ success: false, error: 'Urine Test Fee Already Paid' });
        }

        // Add Urine Test Fee
        isPaymentExist.Urine_test_Fee.push({ 
            UrineTestID: isUrineTestExist._id, 
            BillName: 'Urine Test',
            UrineTestFee: isUrineTestExist.Fee 
        });

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
        const isPaymentExist = await payment.findOne({ PatientID, Complete_Full_Payment: false });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Urine Test Is Exist --- //
        const isUrineTestExist = await urineTest.findById(UrineTestID);
        if (!isUrineTestExist) {
            return res.status(404).json({ success: false, error: 'Urine Test Not Found' });
        }

        // --- Check isUrineTestExist Is Exist By Patient ID --- //
        if (String(isUrineTestExist.PatientID) !== String(PatientID)) {
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

        // --- Update Done in Urine_test_Fee --- //
        const urineFeeItem = isPaymentExist.Urine_test_Fee.find(item => String(item.UrineTestID) === String(isUrineTestExist._id));
        if (urineFeeItem) {
            urineFeeItem.Done = true;
        } else {
            isPaymentExist.Urine_test_Fee.push({
                UrineTestID: isUrineTestExist._id,
                BillName: 'Urine Test',
                UrineTestFee: isUrineTestExist.Fee,
                Done: true
            });
        }

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
        const MedicineBillID = req.params.MedicineBillID || req.params.MedicinID || req.params.MedicineID;
        const PatientID = req.params.PatientID;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findOne({ PatientID, Complete_Full_Payment: false });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Medicine Bill Is Exist --- //
        const isMedicineExist = await medicineBill.findById(MedicineBillID);
        if (!isMedicineExist) {
            return res.status(404).json({ success: false, error: 'Medicine Bill Not Found' });
        }

        // --- Check isMedicineExist Is Exist By Patient ID --- //
        if (String(isMedicineExist.PatientID) !== String(PatientID)) {
            return res.status(404).json({ success: false, error: 'Medicine Bill Not Found By Patient ID' });
        }

        // --- Check PaidStatus Is False in isMedicineExist --- //
        if (isMedicineExist.PaidStatus) {
            return res.status(400).json({ success: false, error: 'Medicine Fee Already Paid' });
        }

        // Add or Update Medicine Fee
        const existingFeeIdx = isPaymentExist.Medicine_Fee.findIndex(
            (item) => String(item.MedicineBillID) === String(isMedicineExist._id)
        );

        if (existingFeeIdx >= 0) {
            isPaymentExist.Medicine_Fee[existingFeeIdx].MedicinePrice = isMedicineExist.Total_Bill;
        } else {
            isPaymentExist.Medicine_Fee.push({ 
                MedicineBillID: isMedicineExist._id, 
                BillName: 'Medicine Bill',
                MedicinePrice: isMedicineExist.Total_Bill 
            });
        }

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
        const MedicineBillID = req.params.MedicineBillID || req.params.MedicinID || req.params.MedicineID;
        const PatientID = req.params.PatientID;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findOne({ PatientID, Complete_Full_Payment: false });
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Medicine Bill Is Exist --- //
        const isMedicineExist = await medicineBill.findById(MedicineBillID);
        if (!isMedicineExist) {
            return res.status(404).json({ success: false, error: 'Medicine Bill Not Found' });
        }

        // --- Check isMedicineExist Is Exist By Patient ID --- //
        if (String(isMedicineExist.PatientID) !== String(PatientID)) {
            return res.status(404).json({ success: false, error: 'Medicine Bill Not Found By Patient ID' });
        }

        // --- Check PaidStatus Is True in isMedicineExist --- //
        if (isMedicineExist.PaidStatus) {
            return res.status(400).json({ success: false, error: 'Medicine Fee Already Paid' });
        }

        // Update Medicine PaidStatus
        isMedicineExist.PaidStatus = true;

        // Update Full_Payment
        isPaymentExist.Full_Payment += isMedicineExist.Total_Bill;

        // --- Update Done in Medicine_Fee --- //
        const medFeeItem = isPaymentExist.Medicine_Fee.find(item => String(item.MedicineBillID) === String(isMedicineExist._id));
        if (medFeeItem) {
            medFeeItem.Done = true;
        } else {
            isPaymentExist.Medicine_Fee.push({
                MedicineBillID: isMedicineExist._id,
                BillName: 'Medicine Bill',
                MedicinePrice: isMedicineExist.Total_Bill,
                Done: true
            });
        }

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
        const targetId = req.params.PaymentID || req.params.PatientID;

        // --- Check Payment Model Is Exist --- //
        let isPaymentExist = await payment.findById(targetId);
        if (!isPaymentExist) {
            isPaymentExist = await payment.findOne({ PatientID: targetId, Complete_Full_Payment: false });
        }
        if (!isPaymentExist) {
            isPaymentExist = await payment.findOne({ PatientID: targetId });
        }
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // Update CompleteStatus and Complete_Full_Payment
        isPaymentExist.CompleteStatus = true;
        isPaymentExist.Complete_Full_Payment = true;

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
        const isPaymentExist = await payment.find({ Complete_Full_Payment: true }).sort({ createdAt: -1 });

        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        const paymentsWithPatients = await Promise.all(
            isPaymentExist.map(async (pay) => {
                let PatientDetails = null;
                if (pay.PatientID) {
                    try {
                        if (mongoose.Types.ObjectId.isValid(pay.PatientID)) {
                            PatientDetails = await patient.findById(pay.PatientID).select("FullName PatientRegID ContactNumber NICNumber");
                        }
                    } catch (e) {}
                    if (!PatientDetails) {
                        PatientDetails = await patient.findOne({ PatientRegID: pay.PatientID }).select("FullName PatientRegID ContactNumber NICNumber");
                    }
                    if (!PatientDetails) {
                        PatientDetails = await patient.findOne({ _id: pay.PatientID }).select("FullName PatientRegID ContactNumber NICNumber");
                    }
                }
                return {
                    ...pay.toObject(),
                    PatientDetails
                };
            })
        );

        res.status(200).json({ success: true, data: paymentsWithPatients });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// 12. Get Complete_Full_Payment False All Payments //
//--------------------------------------------------//

exports.get_Not_Complete_Full_Payments = async (req, res) => {
    try {

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.find({ Complete_Full_Payment: false }).sort({ createdAt: -1 });

        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Get patient FullName and PatientRegID --- //
        const paymentsWithPatients = await Promise.all(
            isPaymentExist.map(async (pay) => {
                let PatientDetails = null;
                if (pay.PatientID) {
                    try {
                        if (mongoose.Types.ObjectId.isValid(pay.PatientID)) {
                            PatientDetails = await patient.findById(pay.PatientID).select("FullName PatientRegID ContactNumber NICNumber");
                        }
                    } catch (e) {}
                    if (!PatientDetails) {
                        PatientDetails = await patient.findOne({ PatientRegID: pay.PatientID }).select("FullName PatientRegID ContactNumber NICNumber");
                    }
                    if (!PatientDetails) {
                        PatientDetails = await patient.findOne({ _id: pay.PatientID }).select("FullName PatientRegID ContactNumber NICNumber");
                    }
                }
                return {
                    ...pay.toObject(),
                    PatientDetails
                };
            })
        );

        res.status(200).json({ success: true, data: paymentsWithPatients });
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
        let isPaymentExist = await payment.findOne({ PatientID, Complete_Full_Payment: false });
        if (!isPaymentExist) {
            isPaymentExist = await payment.findOne({ PatientID }).sort({ createdAt: -1 });
        }
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


// 14. Delete Payment //
//--------------------//

exports.delete_Payment = async (req, res) => {
    try {
        const { PaymentID } = req.params;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findById(PaymentID);
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        await isPaymentExist.deleteOne();

        res.status(200).json({ success: true, message: 'Payment Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 15. Delete Blood_test_Fee From Payment Model //
//----------------------------------------------//

exports.delete_Blood_test_Fee = async (req, res) => {
    try {
        const { PaymentID, BloodTestID } = req.params;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findById(PaymentID);
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Blood Test Is Exist --- //
        const isBloodTestExist = await bloodTest.findById(BloodTestID);
        if (!isBloodTestExist) {
            return res.status(404).json({ success: false, error: 'Blood Test Not Found' });
        }

        // --- Check Blood_test_Fee Is Exist By Blood Test ID --- //
        const isBloodTestFeeExist = isPaymentExist.Blood_test_Fee.find((item) => String(item.BloodTestID) === String(BloodTestID));
        if (!isBloodTestFeeExist) {
            return res.status(404).json({ success: false, error: 'Blood_test_Fee Not Found' });
        }

        // Delete Blood_test_Fee
        isPaymentExist.Blood_test_Fee = isPaymentExist.Blood_test_Fee.filter((item) => String(item.BloodTestID) !== String(BloodTestID));

        await isPaymentExist.save();

        res.status(200).json({ success: true, data: isPaymentExist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 16. Delete Urine_test_Fee From Payment Model //
//----------------------------------------------//

exports.delete_Urine_test_Fee = async (req, res) => {
    try {
        const { PaymentID, UrineTestID } = req.params;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findById(PaymentID);
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // --- Check Urine Test Is Exist --- //
        const isUrineTestExist = await urineTest.findById(UrineTestID);
        if (!isUrineTestExist) {
            return res.status(404).json({ success: false, error: 'Urine Test Not Found' });
        }

        // --- Check Urine_test_Fee Is Exist By Urine Test ID --- //
        const isUrineTestFeeExist = isPaymentExist.Urine_test_Fee.find((item) => String(item.UrineTestID) === String(UrineTestID));
        if (!isUrineTestFeeExist) {
            return res.status(404).json({ success: false, error: 'Urine_test_Fee Not Found' });
        }

        // Delete Urine_test_Fee
        isPaymentExist.Urine_test_Fee = isPaymentExist.Urine_test_Fee.filter((item) => String(item.UrineTestID) !== String(UrineTestID));

        await isPaymentExist.save();

        res.status(200).json({ success: true, data: isPaymentExist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// 17. Delete Medicine From Payment Model //
//---------------------------------------//

exports.delete_Medicine_Fee = async (req, res) => {
    try {
        const { PaymentID } = req.params;
        const MedicineBillID = req.params.MedicineID || req.params.MedicineBillID || req.params.MedicinID;

        // --- Check Payment Model Is Exist --- //
        const isPaymentExist = await payment.findById(PaymentID);
        if (!isPaymentExist) {
            return res.status(404).json({ success: false, error: 'Payment Not Found' });
        }

        // Delete Medicine_Fee from array
        isPaymentExist.Medicine_Fee = isPaymentExist.Medicine_Fee.filter(
            (item) => String(item.MedicineBillID) !== String(MedicineBillID) && String(item.MedicineID) !== String(MedicineBillID) && String(item._id) !== String(MedicineBillID)
        );

        await isPaymentExist.save();

        res.status(200).json({ success: true, message: 'Medicine fee deleted from payment successfully', data: isPaymentExist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
