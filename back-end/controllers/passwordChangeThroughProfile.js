// passwordChangeThroughProfile.js

const User = require('../models/userModel');

const mockPasswordCheck = (storedPassword, providedPassword) => {
  return storedPassword === providedPassword;
};

module.exports = async function changePasswordThroughProfile(req, res) {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'userId, currentPassword and newPassword are required.' });
    }

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (!user.password) {
      return res.status(400).json({ message: 'This account does not have a password set.' });
    }

    const ok = mockPasswordCheck(user.password, currentPassword);
    if (!ok) return res.status(401).json({ message: 'Current password is incorrect.' });

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
