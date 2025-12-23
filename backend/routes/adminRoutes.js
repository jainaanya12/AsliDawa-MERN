// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin'); // Our new admin guard

const User = require('../models/User');
const Medicine = require('../models/Medicine');

// @route   GET /api/admin/stats
// @desc    Get dashboard stats
// @access  Private (Admin)
router.get('/stats', [auth, admin], async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const medicineCount = await Medicine.countDocuments();
    const counterfeitCount = await Medicine.countDocuments({ is_discontinued: true });

    res.json({
      totalUsers: userCount,
      totalMedicines: medicineCount,
      totalCounterfeit: counterfeitCount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- User Management ---

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', [auth, admin], async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Get all users, hide passwords
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private (Admin)
router.delete('/users/:id', [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Admin cannot delete their own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- Medicine Management ---

// @route   POST /api/admin/medicines
// @desc    Add a new medicine
// @access  Private (Admin)
router.post('/medicines', [auth, admin], async (req, res) => {
  try {
    // Assumes frontend sends data matching the Medicine schema
    const newMedicine = new Medicine(req.body);
    await newMedicine.save();
    res.json(newMedicine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/medicines/:id
// @desc    Update a medicine (e.g., mark as counterfeit)
// @access  Private (Admin)
router.put('/medicines/:id', [auth, admin], async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Update with whatever data is sent
      { new: true }
    );
    res.json(medicine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/admin/medicines/:id
// @desc    Delete a medicine
// @access  Private (Admin)
router.delete('/medicines/:id', [auth, admin], async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Medicine deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;