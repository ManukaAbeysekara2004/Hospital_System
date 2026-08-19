const express = require('express');
const router = express.Router();
const PharmacistController = require('../controllers/Pharmacist_Controller');

// 01. Pharmacist Registration //
router.post('/registration', PharmacistController.Pharmacist_Registration);

// 02. Pharmacist Login //
router.post('/login', PharmacistController.Pharmacist_Login);

// 03. Get All Pharmacist Details //
router.get('/get-all-pharmacist-details', PharmacistController.Get_All_Pharmacist_Details);

// 04. Get Pharmacist Approve Status //
router.get('/approve-status/:pharmacistId', PharmacistController.Get_Pharmacist_Approve_Status);

// 05. Get pharmacist details //
router.get('/details/:pharmacistId', PharmacistController.Get_Pharmacist_Details);

// 06. Delete Pharmacist //
router.delete('/delete/:pharmacistId', PharmacistController.Delete_Pharmacist);  

// ------------------------ Update User ------------------------//

// 07. Update phone Number //
router.patch('/update-phone-number/:pharmacistId', PharmacistController.Update_Phone_Number);

// 08. Update Password //
router.patch('/update-password/:pharmacistId', PharmacistController.Update_Password);

module.exports = router;