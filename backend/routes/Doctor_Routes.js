const express = require('express');
const router = express.Router();
const DoctorController = require('../controllers/Doctor_Controller');

router.post('/registration', DoctorController.Doctor_Registration);
router.post('/login', DoctorController.Doctor_Login);
router.patch('/logout/:doctorId', DoctorController.Doctor_Logout);
router.get('/approve-status/:doctorId', DoctorController.Get_Doctor_Approve_Status);
router.get('/in-hospital-availability/:doctorId', DoctorController.Get_Doctor_InHospital_Availability_Status);
router.get('/stop-appointments/:doctorId', DoctorController.Get_Doctor_Stop_Appointments_Status);
router.get('/details/:doctorId', DoctorController.Get_Doctor_Details);
router.delete('/delete/:doctorId', DoctorController.Delete_Doctor);

module.exports = router;