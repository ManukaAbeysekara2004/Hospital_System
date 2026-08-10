const express = require('express');
const router = express.Router();
const DoctorController = require('../controllers/Doctor_Controller');

// 01. Doctor Registration //
router.post('/registration', DoctorController.Doctor_Registration);

// 02. Doctor Login //
router.post('/login', DoctorController.Doctor_Login);

// 03. Doctor Logout //
router.patch('/logout/:doctorId', DoctorController.Doctor_Logout);

// 04. Get Doctor Approve Status //
router.get('/approve-status/:doctorId', DoctorController.Get_Doctor_Approve_Status);

// 05. Get Doctor is In-Hospital Availability Status //
router.get('/in-hospital-availability/:doctorId', DoctorController.Get_Doctor_InHospital_Availability_Status);

// 06. Get Doctor Stop Appointments Status //
router.get('/stop-appointments/:doctorId', DoctorController.Get_Doctor_Stop_Appointments_Status);

// 07. Update Doctor stop Appoinment Status //
router.patch('/stop-appointments/:doctorId', DoctorController.Update_Doctor_Stop_Appointments_Status);

// 08. Get Doctor Details //
router.get('/details/:doctorId', DoctorController.Get_Doctor_Details);

// 09. Delete Doctor //
router.delete('/delete/:doctorId', DoctorController.Delete_Doctor);

module.exports = router;