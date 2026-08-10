const express = require('express');
const router = express.Router();
const NurseWorksController = require('../controllers/Nurse_Works_Controller');

// 01. Create Nurse Works //
router.post('/create/:NurseID/:PatientID', NurseWorksController.Create_Nurse_Works);

// 02. Change Work Done Status //
router.patch('/update/:NurseWorkID/:WorkID', NurseWorksController.Update_Nurse_Work);

// 03. Update AllDone //
router.patch('/update-alldone/:NurseWorkID', NurseWorksController.Update_AllDone);

// 04. Add New Work //
router.post('/add-work/:NurseWorkID', NurseWorksController.Add_New_Work);

// 05. Delete Work //
router.delete('/delete-work/:NurseWorkID', NurseWorksController.Delete_Work);

// 06. Get Nurse Work Details with all pation details and Nurse Name //
router.get('/details/:NurseWorkID', NurseWorksController.Get_Nurse_Work_Details);

// 07. Get All AllDone true Nurse Works //
router.get('/all-alldone-true', NurseWorksController.Get_All_AllDone_true_Nurse_Works);

// 08. Get All AllDone false Nurse Works //
router.get('/all-alldone-false', NurseWorksController.Get_All_AllDone_false_Nurse_Works);

// 09. Get Nurse_Work By NurseId //
router.get('/by-nurse/:NurseID', NurseWorksController.Get_Nurse_Work_By_NurseId);

// 10. Get Nurse_Work By Patient_ID //
router.get('/by-patient/:Patient_ID', NurseWorksController.Get_Nurse_Work_By_Patient_ID);

module.exports = router;