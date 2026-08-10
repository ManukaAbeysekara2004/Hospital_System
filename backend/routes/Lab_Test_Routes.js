const express = require('express');
const router = express.Router();
const Lab_Test_Controller = require('../controllers/Lab_Test_Controller');

// 01. Request for Blood Test //
router.post('/request-blood-test', Lab_Test_Controller.request_Blood_Test);

// 02. Request for Urine Test //
router.post('/request-urine-test', Lab_Test_Controller.request_Urine_Test);

// 03. Get CompleteStatus False Blood Test //
router.get('/get-complete-status-false-blood-test', Lab_Test_Controller.get_Complete_Status_False_Blood_Test);

// 04. Get CompleteStatus False Urine Test //
router.get('/get-complete-status-false-urine-test', Lab_Test_Controller.get_Complete_Status_False_Urine_Test);

// 05. Get CompleteStatus True Blood Test //
router.get('/get-complete-status-true-blood-test', Lab_Test_Controller.get_Complete_Status_True_Blood_Test);

// 06. Get CompleteStatus True Urine Test //
router.get('/get-complete-status-true-urine-test', Lab_Test_Controller.get_Complete_Status_True_Urine_Test);

// 07. Fill Blood Test Form //
router.put('/fill-blood-test-form/:BloodTestID', Lab_Test_Controller.fill_Blood_Test_Form);

// 08. Fill Urine Test Form //
router.put('/fill-urine-test-form/:UrineTestID', Lab_Test_Controller.fill_Urine_Test_Form);

// 09. Get Blood Test Details by Patient ID //
router.get('/get-blood-test-details-by-patient-id/:PatientID', Lab_Test_Controller.get_Blood_Test_Details_By_PatientID);

// 10. Get Urine Test Details by Patient ID //
router.get('/get-urine-test-details-by-patient-id/:PatientID', Lab_Test_Controller.get_Urine_Test_Details_By_PatientID);

module.exports = router;
