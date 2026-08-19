const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/Appointment_Controller');

// 01. Add Appointment //
router.post('/add-appointment/:PatientID/:DoctorID', AppointmentController.Add_Appointment);

// 02. Update Appointment Status //
router.patch('/update-appointment-status/:appointmentId', AppointmentController.Update_Appointment_Status);

// 03. Get the Appointment Status //
router.get('/get-appointment-by-id/:appointmentId', AppointmentController.Get_Appointment_Status_By_ID);

// 04. Get All Pending Appointments //
router.get('/get-all-pending-appointments', AppointmentController.Get_All_Pending_Appointments);

// 05. Get All Inprogress Appointments //
router.get('/get-all-inprogress-appointments', AppointmentController.Get_All_Inprogress_Appointments);

// 06. Get All Completed Appointments //
router.get('/get-all-completed-appointments', AppointmentController.Get_All_Completed_Appointments);

// 07. Get All Cancelled Appointments //
router.get('/get-all-cancelled-appointments', AppointmentController.Get_All_Cancelled_Appointments);

// 08. Delete Appointment //
router.delete('/delete-appointment/:appointmentId', AppointmentController.Delete_Appointment);

// 09. Update Doctor Notes //
router.patch('/update-doctor-notes/:appointmentId', AppointmentController.Update_Doctor_Notes);

// 10. Get All Appointments By Doctor ID //
router.get('/get-all-appointments-by-doctor/:DoctorID', AppointmentController.Get_All_Appointments_By_Doctor_ID);

// 11. Get All Appointments By Patient ID //
router.get('/get-all-appointments-by-patient/:PatientID', AppointmentController.Get_All_Appointments_By_Patient_ID);

// 12. Get All Appointments By Date //
router.get('/get-all-appointments-by-date/:AppointmentDate', AppointmentController.Get_All_Appointments_By_Date);

// 13. Get Appointment Details with doctor and patient details //
router.get('/get-appointment-details/:appointmentId', AppointmentController.Get_Appointment_Details);

module.exports = router;