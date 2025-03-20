const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


// Auth Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// ------------------email routes-------------------
const emailRoutes = require('./routes/email');
app.use('/email', emailRoutes);



// MongoDB Connection

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('The Error is',err));

// Routes
app.get('/', (req, res) => res.send('Email Cleaner API'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));