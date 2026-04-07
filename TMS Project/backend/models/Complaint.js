const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    block: { type: mongoose.Schema.Types.ObjectId, ref: 'Block', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    complaintType: { type: String, required: true },
    remarks: { type: String, required: true },
    attachment: { type: String },
    status: { type: String, enum: ['Pending', 'Assigned', 'In-Progress', 'On-Hold', 'Completed', 'Closed'], default: 'Pending' },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Complaint', complaintSchema);
