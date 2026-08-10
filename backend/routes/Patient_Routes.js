const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/Patient_Controller')

// 01. Add Patient Record //
router.post('/add-patient', PatientController.Add_Patient_Record);

// 02. Search Patient //
router.get('/search/:NICNumber', PatientController.Search_Patient);

// 03. Delete Patient //
router.delete('/delete/:patientId', PatientController.Delete_Patient);  

module.exports = router;