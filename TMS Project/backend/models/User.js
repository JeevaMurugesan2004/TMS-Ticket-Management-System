const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    programme: { type: mongoose.Schema.Types.ObjectId, ref: 'Programme' },
});

module.exports = mongoose.model('User', userSchema);
