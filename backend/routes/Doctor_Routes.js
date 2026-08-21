const express = require('express');
const router = express.Router();
const DoctorController = require('../controllers/Doctor_Controller');

// 01. Doctor Registration //
router.post('/registration', DoctorController.Doctor_Registration);

// 02. Doctor Login //
router.post('/login', DoctorController.Doctor_Login);

// 03. Doctor Logout //
router.patch('/logout/:doctorId', DoctorController.Doctor_Logout);

// 04. Get All Doctor Details //
router.get('/get-all-doctor-details', DoctorController.Get_All_Doctor_Details);

// 05. Get Doctor Approve Status //
router.get('/approve-status/:doctorId', DoctorController.Get_Doctor_Approve_Status);

// 06. Get Doctor is In-Hospital Availability Status //
router.get('/in-hospital-availability/:doctorId', DoctorController.Get_Doctor_InHospital_Availability_Status);

// 07. Get Doctor Stop Appointments Status //
router.get('/stop-appointments/:doctorId', DoctorController.Get_Doctor_Stop_Appointments_Status);

// 08. Update Doctor stop Appoinment Status //
router.patch('/stop-appointments/:doctorId', DoctorController.Update_Doctor_Stop_Appointments_Status);

// 09. Get Doctor Details //
router.get('/details/:doctorId', DoctorController.Get_Doctor_Details);

// 10. Delete Doctor //
router.delete('/delete/:doctorId', DoctorController.Delete_Doctor);

// ------------------------ Update User ------------------------//

// 11. Update Phone Number //
router.patch('/update-phone-number/:doctorId', DoctorController.Update_Phone_Number);

// 12. Update Password //
router.patch('/update-password/:doctorId', DoctorController.Update_Password);

// 13. Forgot Password //
router.patch('/forgot-password', DoctorController.Forgot_Password);

module.exports = router;