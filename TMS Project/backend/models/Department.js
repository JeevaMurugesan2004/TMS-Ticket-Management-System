const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    departmentName: { type: String, required: true, unique: true },
    shortName: { type: String, required: true },
});

module.exports = mongoose.model('Department', departmentSchema);
