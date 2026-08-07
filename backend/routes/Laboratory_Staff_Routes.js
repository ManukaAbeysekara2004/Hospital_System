const express = require('express');
const router = express.Router();
const LaboratoryStaffController = require('../controllers/Laboratory_Staff_Controller');

router.post('/registration', LaboratoryStaffController.Laboratory_Staff_Registration);
router.post('/login', LaboratoryStaffController.Laboratory_Staff_Login);
router.get('/approve-status/:laboratoryStaffId', LaboratoryStaffController.Get_Laboratory_Staff_Approve_Status);

module.exports = router;