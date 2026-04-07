const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Department = require('../models/Department');
const Programme = require('../models/Programme');
const Block = require('../models/Block');
const Room = require('../models/Room');
const Role = require('../models/Role');
const User = require('../models/User');

// All master routes protected
router.use(protect);
const requireAdmin = authorize('superAdmin');

// --- Department ---
router.get('/departments', async (req, res) => {
    try {
        const depts = await Department.find();
        res.json(depts);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/departments', requireAdmin, async (req, res) => {
    try {
        const { departmentName, shortName } = req.body;
        const dept = new Department({ departmentName, shortName });
        await dept.save();
        res.status(201).json(dept);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/departments/:id', requireAdmin, async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.json({ message: 'Department deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Programme ---
router.get('/programmes', async (req, res) => {
    try {
        const progs = await Programme.find().populate('department');
        res.json(progs);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/programmes', requireAdmin, async (req, res) => {
    try {
        const prog = new Programme(req.body);
        await prog.save();
        res.status(201).json(prog);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/programmes/:id', requireAdmin, async (req, res) => {
    try {
        await Programme.findByIdAndDelete(req.params.id);
        res.json({ message: 'Programme deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Block ---
router.get('/blocks', async (req, res) => {
    try {
        const blocks = await Block.find().populate('department programme');
        res.json(blocks);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/blocks', requireAdmin, async (req, res) => {
    try {
        const block = new Block(req.body);
        await block.save();
        res.status(201).json(block);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/blocks/:id', requireAdmin, async (req, res) => {
    try {
        await Block.findByIdAndDelete(req.params.id);
        res.json({ message: 'Block deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Room ---
router.get('/rooms', async (req, res) => {
    try {
        const rooms = await Room.find().populate('department programme block');
        res.json(rooms);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/rooms', requireAdmin, async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(201).json(room);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/rooms/:id', requireAdmin, async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        res.json({ message: 'Room deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Role ---
router.get('/roles', requireAdmin, async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/roles', requireAdmin, async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/roles/:id', requireAdmin, async (req, res) => {
    try {
        await Role.findByIdAndDelete(req.params.id);
        res.json({ message: 'Role deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- User ---
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const users = await User.find().populate('role department programme');
        res.json(users);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
