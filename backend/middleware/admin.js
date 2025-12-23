// backend/middleware/admin.js
const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    // req.user.id is attached by the 'auth' middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if the user is an ADMIN
    if (user.role !== 'ADMIN') {
      return res.status(403).json({ msg: 'Forbidden: Admin access required' });
    }

    // If user is an admin, proceed
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};