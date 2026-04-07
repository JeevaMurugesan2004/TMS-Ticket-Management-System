const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Role = require('./models/Role');

dotenv.config();

const seedRoles = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const roles = [
            'superAdmin', 'Admin', 'user',
            'Networking Staff', 'Plumber', 'Electrician', 'Software Developer'
        ];

        for (let r of roles) {
            await Role.findOneAndUpdate({ roleName: r }, { roleName: r }, { upsert: true });
            console.log(`Role seeded: ${r}`);
        }

        const deleteResult = await Role.deleteMany({ roleName: { $nin: roles } });
        console.log(`Deleted ${deleteResult.deletedCount} unused roles.`);

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding roles:', err.message);
        process.exit(1);
    }
};

seedRoles();
