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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));