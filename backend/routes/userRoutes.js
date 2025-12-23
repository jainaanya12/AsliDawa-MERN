// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   PUT /api/user/cabinet/:medId
// ... (This route is unchanged) ...
router.put('/cabinet/:medId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const medId = req.params.medId;
    const isSaved = user.medicineCabinet.some(id => id.equals(medId));
    let operator = isSaved ? '$pull' : '$addToSet';

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { [operator]: { medicineCabinet: medId } },
      { new: true }
    ).populate('medicineCabinet');

    res.json(updatedUser.medicineCabinet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/user/cabinet
// ... (This route is unchanged) ...
router.get('/cabinet', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('medicineCabinet');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.medicineCabinet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW ROUTE ---
// @route   PUT /api/user/profile
// @desc    Update user profile information
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { username, contactNumber, dateOfBirth, gender } = req.body;

  try {
    // Check if new username is taken by ANOTHER user
    let user = await User.findOne({ username: username });
    if (user && user._id.toString() !== req.user.id) {
      return res.status(400).json({ msg: 'Username already taken' });
    }

    // Check if new contact number is taken by ANOTHER user
    user = await User.findOne({ contactNumber: contactNumber });
    if (user && user._id.toString() !== req.user.id) {
      return res.status(400).json({ msg: 'Contact number already registered' });
    }

    // Find and update the user
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { username, contactNumber, dateOfBirth, gender } },
      { new: true }
    ).select('-password').populate('medicineCabinet'); // Return updated user, minus password

    res.json(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;