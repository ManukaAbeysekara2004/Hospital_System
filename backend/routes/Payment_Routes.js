const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/Payment_Controller');

// 01. Create Payment Only Passing Pation ID //
router.post('/create-payment', PaymentController.create_Payment);

// 02. Add Appointment Fee To Payment Model //
router.post('/add-appointment-fee/:AppointmentID/:PatientID', PaymentController.add_Appointment_Fee);

// 03. Update Appointment PaidStatus to True and Add Appointment Fee To Full_Payment //
router.post('/update-appointment-paidstatus-and-full-payment/:AppointmentID/:PatientID', PaymentController.update_Appointment_PaidStatus_And_Full_Payment);

// 04. Add Blood_test_Fee To Payment Model //
router.post('/add-blood-test-fee/:BloodTestID/:PatientID', PaymentController.add_Blood_test_Fee);

// 05. Update BloodTest PaidStatus to True and Add Blood Test Fee To Full_Payment //
router.post('/update-bloodtest-paidstatus-and-full-payment/:BloodTestID/:PatientID', PaymentController.update_BloodTest_PaidStatus_And_Full_Payment);

// 06. Add Urine_test_Fee To Payment Model //
router.post('/add-urine-test-fee/:UrineTestID/:PatientID', PaymentController.add_Urine_test_Fee);

// 07. Update UrineTest PaidStatus to True and Add Urine Test Fee To Full_Payment //
router.post('/update-urinetest-paidstatus-and-full-payment/:UrineTestID/:PatientID', PaymentController.update_UrineTest_PaidStatus_And_Full_Payment);

// 08. Add Medicine_Fee To Payment Model //
router.post('/add-medicine-fee/:MedicinID/:PatientID', PaymentController.add_Medicine_Fee);

// 09. Update Medicine PaidStatus to True and Add Medicine Fee To Full_Payment //
router.post('/update-medicine-paidstatus-and-full-payment/:MedicinID/:PatientID', PaymentController.update_Medicine_PaidStatus_And_Full_Payment);

// 10. Update CompleteStatus on Payment //
router.post('/update-complete-status/:PatientID', PaymentController.update_CompleteStatus);
router.post('/update-complete-status-by-id/:PaymentID', PaymentController.update_CompleteStatus);

// 11. Get Complete_Full_Payment True All Payments //
router.get('/get-complete-full-payments', PaymentController.get_Complete_Full_Payments);

// 12. Get Complete_Full_Payment False All Payments //
router.get('/get-not-complete-full-payments', PaymentController.get_Not_Complete_Full_Payments);

// 13. Get Payment By Patient ID //
router.get('/get-payment-details-by-patientid/:PatientID', PaymentController.get_Payment_Details_By_patientID);

// 14. Delete Payment //
router.delete('/delete-payment/:PaymentID', PaymentController.delete_Payment);

// 15. Delete Blood_test_Fee From Payment Model //
router.delete('/delete-blood-test-fee/:PaymentID/:BloodTestID', PaymentController.delete_Blood_test_Fee);

// 16. Delete Urine_test_Fee From Payment Model //
router.delete('/delete-urine-test-fee/:PaymentID/:UrineTestID', PaymentController.delete_Urine_test_Fee);

// 17. Delete Medicine From Payment Model //
router.delete('/delete-medicine-fee/:PaymentID/:MedicineID', PaymentController.delete_Medicine_Fee);

module.exports = router;