const mongoose = require('mongoose');

const programmeSchema = new mongoose.Schema({
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    programmeName: { type: String, required: true },
    shortName: { type: String, required: true },
});

module.exports = mongoose.model('Programme', programmeSchema);
