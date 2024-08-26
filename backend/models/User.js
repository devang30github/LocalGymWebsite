const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  otpExpiry: Date,
  exercises: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }] // Array of Exercise references
});

const User = mongoose.model('User', userSchema);

module.exports = User;
