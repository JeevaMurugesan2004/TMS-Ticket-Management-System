const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Role = require('./models/Role');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const adminRole = await Role.findOne({ roleName: 'superAdmin' });
        if (!adminRole) {
            console.error('superAdmin role not found. Please run seed.js first.');
            process.exit(1);
        }

        const email = 'admin@tms.com';
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = new User({
            userName: 'System Administrator',
            phoneNumber: '9999999999',
            email: email,
            password: hashedPassword,
            role: adminRole._id
        });

        await admin.save();
        console.log('SuperAdmin user created successfully!');
        console.log('Email: admin@tms.com');
        console.log('Password: admin123');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err.message);
        process.exit(1);
    }
};

createAdmin();
