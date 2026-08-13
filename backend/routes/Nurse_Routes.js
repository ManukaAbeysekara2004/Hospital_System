const express = require('express');
const router = express.Router();
const NurseController = require('../controllers/Nurse_Controller');

// 01. Nurse Registration //
router.post('/registration', NurseController.Nurse_Registration);

// 02. Nurse Login //
router.post('/login', NurseController.Nurse_Login);

// 03. Nurse Logout //
router.patch('/logout/:nurseId', NurseController.Nurse_Logout)

// 04. Get Nurse Approve Status //
router.get('/approve-status/:nurseId', NurseController.Get_Nurse_Approve_Status);

// 05. Get Is Nurse In Hospital Availability Status //
router.get('/in-hospital-availability-status/:nurseId', NurseController.Get_Nurse_InHospital_Availability_Status);

// 06. Get Is Nurse In Work Status //
router.get('/in-work-status/:nurseId', NurseController.Get_Nurse_InWork_Status);

// 07. Get Nurse Details //
router.get('/details/:nurseId', NurseController.Get_Nurse_Details);

// 08. Delete Nurse //
router.delete('/delete/:nurseId', NurseController.Delete_Nurse);  

// ------------------------ Update User ------------------------//

// 09. Update Phone Number //
router.patch('/update-phone-number/:nurseId', NurseController.Update_Phone_Number);

// 10. Update Password //
router.patch('/update-password/:nurseId', NurseController.Update_Password);

module.exports = router;