// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'],
  },
  contactNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
  medicineCabinet: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine'
  }],
  // --- THIS IS THE NEW FIELD ---
  role: {
    type: String,
    enum: ['USER', 'ADMIN'], // Defines the possible roles
    default: 'USER' // All new signups are 'USER' by default
  }
});

module.exports = User = mongoose.model('user', UserSchema);