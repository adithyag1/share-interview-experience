const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userVerification } = require('../middlewares/authMiddleware');
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const existingUser2=await User.findOne({email});
        if(existingUser2){
            return res.status(400).json({message:'Email already registered'});
        }
        const newUser = new User({
            username,
            email,
            password
        });

        await newUser.save();
        res.status(201).json({ message: 'Registered Successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }
        const token = user.generateAuthToken();
        res.cookie('token',token,{withCredentials:true, httpOnly:true});
        res.status(201).json({message:'Login Successful'});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/',userVerification);

router.post('/logout', (req, res) => {
    res.clearCookie('token', { path: '/', httpOnly: true, sameSite: 'Strict' });
    res.status(200).json({ message: 'Logged out successfully' });
});


module.exports = router;
