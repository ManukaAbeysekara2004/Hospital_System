const express = require('express');
const router = express.Router();
const PharmacistController = require('../controllers/Pharmacist_Controller');

// 01. Pharmacist Registration //
router.post('/registration', PharmacistController.Pharmacist_Registration);

// 02. Pharmacist Login //
router.post('/login', PharmacistController.Pharmacist_Login);

// 03. Get Pharmacist Approve Status //
router.get('/approve-status/:pharmacistId', PharmacistController.Get_Pharmacist_Approve_Status);

// 04. Get pharmacist details //
router.get('/details/:pharmacistId', PharmacistController.Get_Pharmacist_Details);

// 05. Delete Pharmacist //
router.delete('/delete/:pharmacistId', PharmacistController.Delete_Pharmacist);  

module.exports = router;