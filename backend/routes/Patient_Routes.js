const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/Patient_Controller')

router.post('/add-patient', PatientController.Add_Patient_Record);
router.get('/search/:NICNumber', PatientController.Search_Patient);
router.delete('/delete/:patientId', PatientController.Delete_Patient);  

module.exports = router;