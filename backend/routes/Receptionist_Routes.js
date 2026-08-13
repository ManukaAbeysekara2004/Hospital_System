const express = require('express');
const router = express.Router();
const ReceptionistController = require('../controllers/Receptionist_Controller');

// 01. Receptionist Registration //
router.post('/registration', ReceptionistController.Receptionist_Registration);

// 02. Receptionist Login //
router.post('/login', ReceptionistController.Receptionist_Login);

// 03. Get Receptionist Approve Status //
router.get('/approve-status/:receptionistId', ReceptionistController.Get_Receptionist_Approve_Status);

// 04. Get Receptionist Details //
router.get('/details/:receptionistId', ReceptionistController.Get_Receptionist_Details);

// 05. Delete Receptionist //
router.delete('/delete/:receptionistId', ReceptionistController.Delete_Receptionist);

// ------------------------ Update User ------------------------//

// 06. Update Phone Number //
router.patch('/update-phone/:receptionistId', ReceptionistController.Update_Phone_Number);

// 07. Update Password //
router.patch('/update-password/:receptionistId', ReceptionistController.Update_Password);

module.exports = router;