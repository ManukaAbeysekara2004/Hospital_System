const express = require('express');
const router = express.Router();
const PharmacistController = require('../controllers/Pharmacist_Controller');

router.post('/registration', PharmacistController.Pharmacist_Registration);
router.post('/login', PharmacistController.Pharmacist_Login);
router.get('/approve-status/:pharmacistId', PharmacistController.Get_Pharmacist_Approve_Status);

module.exports = router;