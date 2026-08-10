const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/Patient_Controller')

// 01. Add Patient Record //
router.post('/add-patient', PatientController.Add_Patient_Record);

// 02. Search Patient By NIC//
router.get('/search/:NICNumber', PatientController.Search_Patient_NIC);

// 03. Search Patient By PatientRegID//
router.get('/search-by-id/:PatientRegID', PatientController.Search_Patient_By_PatientRegID);

// 04. Delete Patient //
router.delete('/delete/:patientId', PatientController.Delete_Patient);  

module.exports = router;