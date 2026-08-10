const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Success: MongoDB Connected! ✅"))
    .catch(err => console.error("Error: Could not connect to MongoDB", err));

// Routes
app.use('/api/accountant', require('./routes/Accountant_Routes'));
app.use('/api/admin', require('./routes/Admin_Routes'));
app.use('/api/doctor', require('./routes/Doctor_Routes'));
app.use('/api/laboratory_staff', require('./routes/Laboratory_Staff_Routes'));
app.use('/api/nurse', require('./routes/Nurse_Routes'));
app.use('/api/pharmacist', require('./routes/Pharmacist_Routes'));
app.use('/api/receptionist', require('./routes/Receptionist_Routes'));
app.use('/api/patient', require('./routes/Patient_Routes'));
app.use('/api/appointment', require('./routes/Appointment_Routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));