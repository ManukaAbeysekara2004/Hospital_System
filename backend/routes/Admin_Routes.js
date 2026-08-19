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

// 06. Get All Admin Details //
router.get('/get-all-admin-details', AdminController.Get_All_Admin_Details);

// ------------------------ Update Approve Status ------------------------ //

// 07. Update Accountant Approve Status //
router.put('/update-accountant-approve-status/:accountantId', AdminController.Update_Accountant_Approve_Status);

// 08. Update Admin Approve Status //
router.put('/update-admin-approve-status/:adminId', AdminController.Update_Admin_Approve_Status);

// 09. Update Doctor Approve Status //
router.put('/update-doctor-approve-status/:doctorId', AdminController.Update_Doctor_Approve_Status);

// 10. Update Lab Staff Approve Status //
router.put('/update-lab-staff-approve-status/:labStaffId', AdminController.Update_Lab_Staff_Approve_Status);

// 11. Update Nurse Approve Status //
router.put('/update-nurse-approve-status/:nurseId', AdminController.Update_Nurse_Approve_Status);

// 12. Update Pharmacist Approve Status //
router.put('/update-pharmacist-approve-status/:pharmacistId', AdminController.Update_Pharmacist_Approve_Status);

// 13. Update Receptionist Approve Status //
router.put('/update-receptionist-approve-status/:receptionistId', AdminController.Update_Receptionist_Approve_Status);

// ------------------------ Bill Manage ------------------------//

// 14. Get Bill Prices Details //
router.get('/get-bill-prices-details', AdminController.Get_All_Bill_Prices_Details);

// 15. Update Appointment_Price //
router.put('/update-appointment-price/:billPriceId', AdminController.Update_Appointment_Price);

// 16. Update Blood_Test_Price //
router.put('/update-blood-test-price/:billPriceId', AdminController.Update_Blood_Test_Price);

// 17. Update Urine_Test_Price //
router.put('/update-urine-test-price/:billPriceId', AdminController.Update_Urine_Test_Price);

// 18. Create Bill Price //
router.post('/create-bill-price', AdminController.Create_Bill_Price);

// ------------------------ Update User ------------------------//

// 19. Update Phone Number //
router.patch('/update-phone-number/:adminId', AdminController.Update_Phone_Number);

// 20. Update Password //
router.patch('/update-password/:adminId', AdminController.Update_Password);

// ------------------------ Delete User ------------------------//

// 21. Delete Accountant //
router.delete('/delete-accountant/:accountantId', AdminController.Admin_Delete_Accountant);

// 22. Delete Admin //
router.delete('/delete-admin/:adminId', AdminController.Admin_Delete_Admin);

// 23. Delete Doctor //
router.delete('/delete-doctor/:doctorId', AdminController.Admin_Delete_Doctor);

// 24. Delete Lab Staff //
router.delete('/delete-lab-staff/:labStaffId', AdminController.Admin_Delete_Lab_Staff);

// 25. Delete Nurse //
router.delete('/delete-nurse/:nurseId', AdminController.Admin_Delete_Nurse);

// 26. Delete Pharmacist //
router.delete('/delete-pharmacist/:pharmacistId', AdminController.Admin_Delete_Pharmacist);

// 27. Delete Receptionist //
router.delete('/delete-receptionist/:receptionistId', AdminController.Admin_Delete_Receptionist);

module.exports = router;