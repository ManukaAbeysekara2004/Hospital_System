const express = require('express');
const router = express.Router();
const LaboratoryStaffController = require('../controllers/Laboratory_Staff_Controller');

router.post('/registration', LaboratoryStaffController.Laboratory_Staff_Registration);
router.post('/login', LaboratoryStaffController.Laboratory_Staff_Login);
router.get('/approve-status/:laboratoryStaffId', LaboratoryStaffController.Get_Laboratory_Staff_Approve_Status);
router.get('/details/:laboratoryStaffId', LaboratoryStaffController.Get_Laboratory_Staff_Details);
router.delete('/delete/:laboratoryStaffId', LaboratoryStaffController.Delete_Laboratory_Staff);

module.exports = router;