const express = require('express');
const router = express.Router();
const MedicineController = require('../controllers/Medicine_Controller');

// ------------------------ Medicine ------------------------//

// 01. Add Medicine //
router.post('/add-medicine', MedicineController.add_Medicine);

// 02. Update Medicine Quantity //
router.patch('/update-medicine-quantity/:MedicineID', MedicineController.update_Medicine_Quantity);

// 03. Update Medicine UnitPrice //
router.patch('/update-medicine-unitprice/:MedicineID', MedicineController.update_Medicine_UnitPrice);

// 04. Get Medicine UnitPrice //
router.get('/get-medicine-unitprice/:MedicineID', MedicineController.get_UnitPrice);

// 05. Get Medicine Quantity //
router.get('/get-medicine-quantity/:MedicineID', MedicineController.get_Quantity);

// 06. Delete Medicine //
router.delete('/delete-medicine/:MedicineID', MedicineController.delete_Medicine);

// 07. Get All Medicine Details //
router.get('/get-all-medicine-details', MedicineController.get_All_Medicine_Details);

// 08. Get Medicine Details by TabletName //
router.get('/get-medicine-details', MedicineController.get_Medicine_Details_by_TabletName);

// ------------------------ Medicine Bill ------------------------//

// 09. Create Medicine Bill //
router.post('/create-medicine-bill/:PatientID/:DoctorID', MedicineController.create_Medicine_Bill);

// 10. Delete Medicine Bill //
router.delete('/delete-medicine-bill/:MedicineBillID', MedicineController.delete_Medicine_Bill);

// 11. Add Medicine to Bill //
router.patch('/add-medicine-to-bill/:MedicineBillID', MedicineController.add_Medicine_to_Bill);

// 13. Update Complete Status //
router.patch('/update-complete-status/:MedicineBillID', MedicineController.update_Complete_Status);

// 14. Get All CompleteStatus True Medicine Bill with patient and Doctore Details //
router.get('/get-complete-status-true-medicine-bill', MedicineController.get_Complete_Status_True_Medicine_Bill);

// 15. Get All CompleteStatus False Medicine Bill with patient and Doctore Details //
router.get('/get-complete-status-false-medicine-bill', MedicineController.get_Complete_Status_False_Medicine_Bill);

// 16. Get All Medicine bills By DoctorID //
router.get('/get-medicine-bills-by-doctor/:DoctorID', MedicineController.get_Medicine_Bills_By_DoctorID);

// 17. Get All Medicine bills By PatientID //
router.get('/get-medicine-bills-by-patient/:PatientID', MedicineController.get_Medicine_Bills_By_PatientID);

module.exports = router;