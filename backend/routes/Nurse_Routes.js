const express = require('express');
const router = express.Router();
const NurseController = require('../controllers/Nurse_Controller');

router.post('/registration', NurseController.Nurse_Registration);
router.post('/login', NurseController.Nurse_Login);
router.get('/approve-status/:nurseId', NurseController.Get_Nurse_Approve_Status);

module.exports = router;