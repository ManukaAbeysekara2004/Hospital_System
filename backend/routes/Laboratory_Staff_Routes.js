const express = require('express');
const router = express.Router();
const LaboratoryStaffController = require('../controllers/Laboratory_Staff_Controller');

// 01. Laboratory Staff Registration //
router.post('/registration', LaboratoryStaffController.Laboratory_Staff_Registration);

// 02. Laboratory Staff Login //
router.post('/login', LaboratoryStaffController.Laboratory_Staff_Login);

// 03. Get All Lab Staff Details //
router.get('/get-all-lab-staff-details', LaboratoryStaffController.Get_All_Lab_Staff_Details);

// 04. Get Laboratory Staff Approve Status //
router.get('/approve-status/:laboratoryStaffId', LaboratoryStaffController.Get_Laboratory_Staff_Approve_Status);

// 05. Get Laboratory Staff Details //
router.get('/details/:laboratoryStaffId', LaboratoryStaffController.Get_Laboratory_Staff_Details);

// 06. Delete Laboratory Staff //
router.delete('/delete/:laboratoryStaffId', LaboratoryStaffController.Delete_Laboratory_Staff);

// ------------------------ Update User ------------------------//

// 07. Update Phone Number //
router.patch('/update-phone-number/:laboratoryStaffId', LaboratoryStaffController.Update_Phone_Number);

// 08. Update Password //
router.patch('/update-password/:laboratoryStaffId', LaboratoryStaffController.Update_Password);

module.exports = router;