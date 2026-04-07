const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Role = require('./models/Role');

dotenv.config();

const setupUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const roles = await Role.find({});
        const roleMap = {};
        roles.forEach(r => roleMap[r.roleName] = r._id);

        console.log('Roles found in DB:', Object.keys(roleMap).join(', '));

        const usersToCreate = [
            { email: 'admin@tms.com',   password: 'password123', userName: 'Super Admin',       roleName: 'superAdmin',       phoneNumber: '9999999999' },
            { email: 'admin2@tms.com',  password: 'password123', userName: 'System Admin',       roleName: 'Admin',            phoneNumber: '9999999998' },
            { email: 'user@tms.com',    password: 'password123', userName: 'Regular User',       roleName: 'user',             phoneNumber: '9999999997' },
            { email: 'plumber@tms.com', password: 'password123', userName: 'John Plumber',       roleName: 'Plumber',          phoneNumber: '9999999996' },
            { email: 'sparky@tms.com',  password: 'password123', userName: 'Electrician Mike',   roleName: 'Electrician',      phoneNumber: '9999999995' },
            { email: 'net@tms.com',     password: 'password123', userName: 'Networking Sarah',   roleName: 'Networking Staff', phoneNumber: '9999999994' },
            { email: 'manager@tms.com', password: 'password123', userName: 'Complaint Manager',  roleName: 'Admin',            phoneNumber: '9999999993' },
        ];

        for (const u of usersToCreate) {
            if (!roleMap[u.roleName]) {
                console.warn(`⚠️  Role "${u.roleName}" not found in DB. Skipping user: ${u.email}. Run seed.js first.`);
                continue;
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(u.password, salt);

            const existing = await User.findOne({ email: u.email });
            if (!existing) {
                const newUser = new User({
                    userName: u.userName,
                    phoneNumber: u.phoneNumber,
                    email: u.email,
                    password: hashedPassword,
                    role: roleMap[u.roleName]
                });
                await newUser.save();
                console.log(`✅ Created: ${u.email} (${u.roleName}) — password: ${u.password}`);
            } else {
                existing.password = hashedPassword;
                existing.role = roleMap[u.roleName];
                await existing.save();
                console.log(`🔄 Updated: ${u.email} → role: ${u.roleName}`);
            }
        }

        console.log('Users setup complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

setupUsers();
