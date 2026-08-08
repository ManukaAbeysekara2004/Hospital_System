const express = require('express');
const router = express.Router();
const ReceptionistController = require('../controllers/Receptionist_Controller');

router.post('/registration', ReceptionistController.Receptionist_Registration);
router.post('/login', ReceptionistController.Receptionist_Login);
router.get('/approve-status/:receptionistId', ReceptionistController.Get_Receptionist_Approve_Status);
router.get('/details/:receptionistId', ReceptionistController.Get_Receptionist_Details);
router.delete('/delete/:receptionistId', ReceptionistController.Delete_Receptionist);

module.exports = router;