const express = require('express');
const router = express.Router();
const LaboratoryStaffController = require('../controllers/Laboratory_Staff_Controller');

// 01. Laboratory Staff Registration //
router.post('/registration', LaboratoryStaffController.Laboratory_Staff_Registration);

// 02. Laboratory Staff Login //
router.post('/login', LaboratoryStaffController.Laboratory_Staff_Login);

// 03. Get Laboratory Staff Approve Status //
router.get('/approve-status/:laboratoryStaffId', LaboratoryStaffController.Get_Laboratory_Staff_Approve_Status);

// 04. Get Laboratory Staff Details //
router.get('/details/:laboratoryStaffId', LaboratoryStaffController.Get_Laboratory_Staff_Details);

// 05. Delete Laboratory Staff //
router.delete('/delete/:laboratoryStaffId', LaboratoryStaffController.Delete_Laboratory_Staff);

module.exports = router;