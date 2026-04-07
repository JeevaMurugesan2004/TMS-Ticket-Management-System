const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');

// @route   POST api/auth/seed
// @desc    Seed initial roles
router.post('/seed', async (req, res) => {
    try {
        const roles = [
            'superAdmin', 'Admin', 'user'
        ];
        for (let r of roles) {
            await Role.findOneAndUpdate({ roleName: r }, { roleName: r }, { upsert: true });
        }
        res.json({ message: 'Roles seeded successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST api/auth/register
// @desc    Register a user
router.post('/register', async (req, res) => {
    const { userName, phoneNumber, email, password, roleName, department, programme } = req.body;
    try {
        let user = await User.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const role = await Role.findOne({ roleName });
        if (!role) return res.status(400).json({ message: 'Role not found' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            userName,
            phoneNumber,
            email,
            password: hashedPassword,
            role: role._id,
            department: department || undefined,
            programme: programme || undefined
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } }).populate('role');
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role.roleName,
                department: user.department,
                programme: user.programme
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
