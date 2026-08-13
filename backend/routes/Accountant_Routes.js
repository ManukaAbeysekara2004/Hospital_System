const express = require('express');
const router = express.Router();
const AccountantController = require('../controllers/Accountant_Controller');

// 01. Accountant Registration //
router.post('/registration', AccountantController.Accountant_Registration);

// 02. Accountant Login //
router.post('/login', AccountantController.Accountant_Login);

// 03. Get Accountant Approve Status //
router.get('/approve-status/:accountantId', AccountantController.Get_Approve_Status);

// 04. Get Accountant Details //
router.get('/details/:accountantId', AccountantController.Get_Accountant_Details);

// 05. Delete Accountant //
router.delete('/delete/:accountantId', AccountantController.Delete_Accountant);

// ------------------------ Update User ------------------------//

// 06. Update Contact Number //
router.patch('/update-contact-number/:accountantId', AccountantController.Update_Contact_Number);

// 07. Update Password //
router.patch('/update-password/:accountantId', AccountantController.Update_Password);

module.exports = router;