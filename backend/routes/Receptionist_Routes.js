const express = require('express');
const router = express.Router();
const ReceptionistController = require('../controllers/Receptionist_Controller');

// 01. Receptionist Registration //
router.post('/registration', ReceptionistController.Receptionist_Registration);

// 02. Receptionist Login //
router.post('/login', ReceptionistController.Receptionist_Login);

// 03. Get All Receptionist Details //
router.get('/get-all-receptionist-details', ReceptionistController.Get_All_Receptionist_Details);

// 04. Get Receptionist Approve Status //
router.get('/approve-status/:receptionistId', ReceptionistController.Get_Receptionist_Approve_Status);

// 05. Get Receptionist Details //
router.get('/details/:receptionistId', ReceptionistController.Get_Receptionist_Details);

// 06. Delete Receptionist //
router.delete('/delete/:receptionistId', ReceptionistController.Delete_Receptionist);

// ------------------------ Update User ------------------------//

// 07. Update Phone Number //
router.patch('/update-phone/:receptionistId', ReceptionistController.Update_Phone_Number);

// 08. Update Password //
router.patch('/update-password/:receptionistId', ReceptionistController.Update_Password);

module.exports = router;