const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin_Controller');

router.post('/registration', AdminController.Admin_Registration);
router.post('/login', AdminController.Admin_Login);
router.get('/approve-status/:adminId', AdminController.Get_Admin_Approve_Status);
router.get('/details/:adminId', AdminController.Get_Admin_Details);
router.delete('/delete/:adminId', AdminController.Delete_Admin);    

module.exports = router;