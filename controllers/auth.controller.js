const { User } = require('../models');
const jwt = require('jsonwebtoken');

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.signup = async (req, res) => {
  const { mobile } = req.body;
  try {
    let user = await User.findOne({ where: { mobile } });
    if (!user) {
      user = await User.create({ mobile });
    }
    res.status(200).json({ success: true, message: 'User registered', user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error signing up', error: err.message });
  }
};

exports.sendOtp = async (req, res) => {
  const { mobile } = req.body;
  try {
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    let user = await User.findOne({ where: { mobile } });
    if (!user) user = await User.create({ mobile });

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    res.status(200).json({ success: true, message: 'OTP sent (mocked)', otp }); // <- Return mocked OTP
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;
  try {
    const user = await User.findOne({ where: { mobile } });
    if (!user || user.otp !== otp || new Date(user.otpExpires) < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const token = jwt.sign({ id: user.id, mobile: user.mobile }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'OTP verification failed', error: err.message });
  }
};
