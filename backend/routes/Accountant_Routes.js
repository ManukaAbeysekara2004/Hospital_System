const express = require('express');
const router = express.Router();
const AccountantController = require('../controllers/Accountant_Controller');

router.post('/registration', AccountantController.Accountant_Registration);
router.post('/login', AccountantController.Accountant_Login);
router.get('/approve-status/:accountantId', AccountantController.Get_Approve_Status);
router.get('/details/:accountantId', AccountantController.Get_Accountant_Details);
router.delete('/delete/:accountantId', AccountantController.Delete_Accountant);

module.exports = router;