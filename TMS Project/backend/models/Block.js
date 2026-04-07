const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    programme: { type: mongoose.Schema.Types.ObjectId, ref: 'Programme', required: true },
    blockName: { type: String, required: true },
});

module.exports = mongoose.model('Block', blockSchema);
