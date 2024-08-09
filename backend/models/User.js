// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  membershipType: String,
  termsAgreed: Boolean,
  paymentConfirmed: { type: Boolean, default: false },
  membershipStartDate: Date,
  membershipExpiryDate: Date,
  otp: String,
  otpExpiry: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;

