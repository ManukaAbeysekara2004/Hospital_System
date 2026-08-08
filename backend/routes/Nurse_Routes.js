const express = require('express');
const router = express.Router();
const NurseController = require('../controllers/Nurse_Controller');

router.post('/registration', NurseController.Nurse_Registration);
router.post('/login', NurseController.Nurse_Login);
router.patch('/logout/:nurseId', NurseController.Nurse_Logout)
router.get('/approve-status/:nurseId', NurseController.Get_Nurse_Approve_Status);
router.get('/in-hospital-availability-status/:nurseId', NurseController.Get_Nurse_InHospital_Availability_Status);
router.get('/in-work-status/:nurseId', NurseController.Get_Nurse_InWork_Status);
router.get('/details/:nurseId', NurseController.Get_Nurse_Details);
router.delete('/delete/:nurseId', NurseController.Delete_Nurse);  

module.exports = router;