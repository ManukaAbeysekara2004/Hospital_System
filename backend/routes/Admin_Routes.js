const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin_Controller');

// 01. Admin Registration //
router.post('/registration', AdminController.Admin_Registration);

// 02. Admin Login //
router.post('/login', AdminController.Admin_Login);

// 03. Get Admin Approve Status //
router.get('/approve-status/:adminId', AdminController.Get_Admin_Approve_Status);

// 04. Get Admin Details //
router.get('/details/:adminId', AdminController.Get_Admin_Details);

// 05. Delete Admin //
router.delete('/delete/:adminId', AdminController.Delete_Admin);    

module.exports = router;