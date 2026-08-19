const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/Patient_Controller')

// 01. Add Patient Record //
router.post('/add-patient', PatientController.Add_Patient_Record);

// 02. Delete Patient //
router.delete('/delete/:patientId', PatientController.Delete_Patient);

// 03. Get all patiens //
router.get('/get-all-patients', PatientController.Get_All_Patients);

// ------------------------ Update User ------------------------//

// 04. Update Contact Number //
router.patch('/update-contact-number/:patientId', PatientController.Update_Contact_Number);

module.exports = router;