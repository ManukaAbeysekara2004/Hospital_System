const express = require('express');
const router = express.Router();
const AccountantController = require('../controllers/Accountant_Controller');

router.post('/registration', AccountantController.Accountant_Registration);
router.post('/login', AccountantController.Accountant_Login);
router.get('/approve-status/:accountantId', AccountantController.Get_Approve_Status);

module.exports = router;