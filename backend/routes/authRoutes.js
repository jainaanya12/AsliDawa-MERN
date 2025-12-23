// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/User');
const auth = require('../middleware/auth');

// Password Regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordErrorMsg = 'Password must be at least 8 characters and contain one uppercase, one lowercase, one number, and one special character.';

// @route   GET /api/auth
// @desc    Get logged-in user's data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // --- THIS LINE IS UPDATED ---
    // We now .populate() the medicineCabinet to send it with the user data
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('medicineCabinet');
      
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/register
// ... (This route is unchanged) ...
router.post('/register', async (req, res) => {
  const { username, email, password, dateOfBirth, gender, contactNumber } = req.body;
  try {
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ msg: passwordErrorMsg });
    }
    let user = await User.findOne({ 
      $or: [{ email }, { username }, { contactNumber }] 
    });
    if (user) {
      if (user.email === email) return res.status(400).json({ msg: 'Email already registered' });
      if (user.username === username) return res.status(400).json({ msg: 'Username already taken' });
      if (user.contactNumber === contactNumber) return res.status(400).json({ msg: 'Contact number already registered' });
    }
    user = new User({
      username, email, password, dateOfBirth, gender, contactNumber,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// ... (This route is unchanged) ...
router.post('/login', async (req, res) => {
  const { loginIdentifier, password } = req.body;
  try {
    let user = await User.findOne({
      $or: [
        { email: { $regex: new RegExp("^" + loginIdentifier + "$", "i") } },
        { username: { $regex: new RegExp("^" + loginIdentifier + "$", "i") } }
      ]
    });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/changepassword
// ... (This route is unchanged) ...
router.post('/changepassword', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ msg: passwordErrorMsg });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect old password' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/auth
// ... (This route is unchanged) ...
router.delete('/', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: 'User account deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;