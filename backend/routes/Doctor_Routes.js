const express = require('express');
const router = express.Router();
const DoctorController = require('../controllers/Doctor_Controller');

router.post('/registration', DoctorController.Doctor_Registration);
router.post('/login', DoctorController.Doctor_Login);
router.get('/approve-status/:doctorId', DoctorController.Get_Doctor_Approve_Status);

module.exports = router;