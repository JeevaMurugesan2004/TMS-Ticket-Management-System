const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// @route   POST api/complaints
// @desc    Raise a complaint
router.post('/', protect, authorize('user', 'Admin', 'superAdmin'), upload.single('attachment'), async (req, res) => {
    try {
        const { block, room, complaintType, remarks } = req.body;
        const attachment = req.file ? `/uploads/${req.file.filename}` : '';
        
        const complaint = new Complaint({
            user: req.user._id,
            block,
            room,
            complaintType,
            remarks,
            attachment
        });
        await complaint.save();

        // Send Email Notification to Admin/Staff
        const adminEmailSubject = `New Complaint Raised: #${complaint._id.toString().slice(-6).toUpperCase()}`;
        const adminEmailText = `A new complaint has been raised.\n\nType: ${complaintType}\nRemarks: ${remarks}\nLocation: Block ${block}, Room ${room}\n\nLink: http://localhost:3000/complaints`;
        await sendEmail(adminEmailSubject, adminEmailText);

        // Send Confirmation Email to User
        const userEmailSubject = `Complaint Registered: #${complaint._id.toString().slice(-6).toUpperCase()}`;
        const userEmailText = `Your complaint has been successfully registered.\n\nTicket ID: #${complaint._id.toString().slice(-6).toUpperCase()}\nType: ${complaintType}\nRemarks: ${remarks}\n\nWe will notify you once there is an update.\n\nLink: http://localhost:3000/complaints`;
        await sendEmail(userEmailSubject, userEmailText, req.user.email);

        res.status(201).json(complaint);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

const getRoleCategories = (roleName) => {
    const mapping = {
        'Plumber': ['Plumbing'],
        'Networking Staff': ['Network'],
        'Electrician': ['Electronics'],
        'Software Developer': ['PC Hardware', 'PC Software', 'Application Issues'],
        'Admin': [] // Admin usually sees all, but can be defined if needed
    };
    return mapping[roleName] || [];
};

// @route   GET api/complaints
// @desc    Get complaints (RBAC filtered)
router.get('/', protect, async (req, res) => {
    try {
        let query = {};
        const role = req.user.role.roleName;

        if (role === 'user') {
            query.user = req.user._id;
        } else if (role !== 'superAdmin') {
            const allowedCategories = getRoleCategories(role);
            
            // Technician/Staff: See tickets assigned to them OR unassigned tickets in their categories
            const unassignedCondition = {
                $or: [{ assignee: null }, { assignee: { $exists: false } }]
            };
            const staffQuery = {
                $or: [
                    { assignee: req.user._id },
                    {
                        ...unassignedCondition,
                        ...(allowedCategories.length > 0 && { complaintType: { $in: allowedCategories } })
                    }
                ]
            };
            query = { ...query, ...staffQuery };
        }
        // SuperAdmin sees all

        // Filters from query
        if (req.query.status) query.status = req.query.status;
        if (req.query.complaintType) query.complaintType = req.query.complaintType;
        if (req.query.assignee) query.assignee = req.query.assignee;

        const complaints = await Complaint.find(query)
            .populate('user block room assignee')
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// @route   PUT api/complaints/:id
// @desc    Update complaint status or assignment
router.put('/:id', protect, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        const role = req.user.role.roleName;
        const staffRoles = ['Admin', 'Networking Staff', 'Plumber', 'Electrician', 'Software Developer'];

        if (role === 'superAdmin') {
            if (req.body.assignee) complaint.assignee = req.body.assignee;
            if (req.body.status) complaint.status = req.body.status;
        } else if (staffRoles.includes(role)) {
            const isAssignedToMe = complaint.assignee && complaint.assignee.toString() === req.user._id.toString();
            const isUnassigned = !complaint.assignee;
            const myCategories = getRoleCategories(role);
            const canHandleType = myCategories.length === 0 || myCategories.includes(complaint.complaintType);

            if (isAssignedToMe) {
                // Already assigned to me — allow status update
                if (req.body.status) complaint.status = req.body.status;
            } else if (isUnassigned && canHandleType) {
                // Unassigned ticket in my category — allow self-assign
                complaint.assignee = req.user._id;
                complaint.status = req.body.status || 'Assigned';
            } else {
                return res.status(403).json({ message: 'Not authorized to update this complaint' });
            }
        } else {
            return res.status(403).json({ message: 'Not authorized to update complaints' });
        }

        await complaint.save();

        // Send Email Notification on Status Update
        if (req.body.status || req.body.assignee) {
            const ticketIdShort = complaint._id.toString().slice(-6).toUpperCase();
            const emailSubject = `Complaint Updated: #${ticketIdShort}`;
            const emailText = `Complaint status for #${ticketIdShort} has been updated to: ${complaint.status}.\n\nRemarks: ${complaint.remarks}\n\nLink: http://localhost:3000/complaints`;
            
            // 1. Notify the User (Complainer)
            const complainer = await User.findById(complaint.user);
            if (complainer && complainer.email) {
                await sendEmail(emailSubject, emailText, complainer.email);
            }

            // 2. Notify the Assignee (Staff) if changed/assigned
            let recipientEmail = process.env.NOTIFICATION_EMAIL;
            if (complaint.assignee) {
                const assigneeUser = await User.findById(complaint.assignee);
                if (assigneeUser && assigneeUser.email) {
                    recipientEmail = assigneeUser.email;
                }
            }
            await sendEmail(emailSubject, emailText, recipientEmail);
        }

        res.json(complaint);
    } catch (err) { 
        console.error('Error in PUT /api/complaints/:id:', err);
        res.status(500).json({ message: err.message }); 
    }
});

// @route   GET api/complaints/dashboard
// @desc    Get dashboard stats
router.get('/dashboard', protect, async (req, res) => {
    try {
        let query = {};
        const role = req.user.role.roleName;
        if (role === 'user') query.user = req.user._id;
        else if (role !== 'superAdmin') {
            const allowedCategories = getRoleCategories(role);
            query.$or = [
                { assignee: req.user._id },
                {
                    $or: [{ assignee: null }, { assignee: { $exists: false } }],
                    ...(allowedCategories.length > 0 && { complaintType: { $in: allowedCategories } })
                }
            ];
        }

        const total = await Complaint.countDocuments(query);
        const pending = await Complaint.countDocuments({ ...query, status: 'Pending' });
        const assigned = await Complaint.countDocuments({ ...query, status: 'Assigned' });
        const closed = await Complaint.countDocuments({ ...query, status: 'Completed' }); // Or 'Closed'

        res.json({ total, pending, assigned, closed });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// @route   POST api/complaints/send-report
// @desc    Send report summary to email
router.post('/send-report', protect, authorize('superAdmin'), async (req, res) => {
    try {
        const { reports, filters } = req.body;
        
        if (!reports || !Array.isArray(reports)) {
            return res.status(400).json({ message: 'Report data is required' });
        }

        const date = new Date().toLocaleString();
        const emailSubject = `TMS System Report - ${new Date().toLocaleDateString()}`;
        
        let reportDetails = `Ticket Management System - Report Summary\n`;
        reportDetails += `Generated on: ${date}\n`;
        reportDetails += `Filters: ${filters.status || 'All'} Status, ${filters.type || 'All'} Category\n`;
        reportDetails += `Total Records: ${reports.length}\n\n`;
        reportDetails += `--------------------------------------------------\n`;
        reportDetails += `ID\t| Category\t| Status\t| Assignee\n`;
        reportDetails += `--------------------------------------------------\n`;

        reports.forEach(r => {
            const ticketId = `#${r._id.slice(-6).toUpperCase()}`;
            const category = r.complaintType;
            const status = r.status;
            const assignee = r.assignee?.userName || 'Unassigned';
            reportDetails += `${ticketId}\t| ${category}\t| ${status}\t| ${assignee}\n`;
        });

        reportDetails += `--------------------------------------------------\n\n`;
        reportDetails += `View full details: http://localhost:3000/reports`;

        await sendEmail(emailSubject, reportDetails);

        res.json({ message: 'Report sent successfully to email' });
    } catch (err) {
        console.error('Error in POST /api/complaints/send-report:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

