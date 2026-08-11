const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin_Controller');

// 01. Admin Registration //
router.post('/registration', AdminController.Admin_Registration);

// 02. Admin Login //
router.post('/login', AdminController.Admin_Login);

// 03. Get Admin Approve Status //
router.get('/approve-status/:adminId', AdminController.Get_Admin_Approve_Status);

// 04. Get Admin Details //
router.get('/details/:adminId', AdminController.Get_Admin_Details);

// 05. Delete Admin //
router.delete('/delete/:adminId', AdminController.Delete_Admin);    

// 06. Get All Accountant Details //
router.get('/get-all-accountant-details', AdminController.Get_All_Accountant_Details);

// 07. Get All Admin Details //
router.get('/get-all-admin-details', AdminController.Get_All_Admin_Details);

// 08. Get All Doctor Details //
router.get('/get-all-doctor-details', AdminController.Get_All_Doctor_Details);

// 09. Get All Lab Staff Details //
router.get('/get-all-lab-staff-details', AdminController.Get_All_Lab_Staff_Details);

// 10. Get All Nurse Details //
router.get('/get-all-nurse-details', AdminController.Get_All_Nurse_Details);

// 11. Get All Patient Details //
router.get('/get-all-patient-details', AdminController.Get_All_Patient_Details);

// 12. Get All Pharmacist Details //
router.get('/get-all-pharmacist-details', AdminController.Get_All_Pharmacist_Details);

// 13. Get All Receptionist Details //
router.get('/get-all-receptionist-details', AdminController.Get_All_Receptionist_Details);

// 14. Update Accountant Approve Status //
router.put('/update-accountant-approve-status/:accountantId', AdminController.Update_Accountant_Approve_Status);

// 15. Update Admin Approve Status //
router.put('/update-admin-approve-status/:adminId', AdminController.Update_Admin_Approve_Status);

// 16. Update Doctor Approve Status //
router.put('/update-doctor-approve-status/:doctorId', AdminController.Update_Doctor_Approve_Status);

// 17. Update Lab Staff Approve Status //
router.put('/update-lab-staff-approve-status/:labStaffId', AdminController.Update_Lab_Staff_Approve_Status);

// 18. Update Nurse Approve Status //
router.put('/update-nurse-approve-status/:nurseId', AdminController.Update_Nurse_Approve_Status);

// 19. Update Pharmacist Approve Status //
router.put('/update-pharmacist-approve-status/:pharmacistId', AdminController.Update_Pharmacist_Approve_Status);

// 20. Update Receptionist Approve Status //
router.put('/update-receptionist-approve-status/:receptionistId', AdminController.Update_Receptionist_Approve_Status);

module.exports = router;