const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('./models/User');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
const mongoURI = process.env.MONGO_URI;
const mail_user=process.env.EMAIL_USER;
const mail_pass=process.env.EMAIL_PASS;

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(mongoURI);

const calculateMembershipEndDate = (membershipType) => {
  const duration = {
    'personal_training_basic-1': 1,
    'personal_training_standard-1': 1,
    'personal_training_premium-1': 1,
    'personal_training_basic-2': 6,
    'personal_training_standard-2': 6,
    'personal_training_premium-2': 6,
    'personal_training_basic-3': 12,
    'personal_training_standard-3': 12,
    'personal_training_premium-3': 12,
    'membership_plan_basic-1': 1,
    'membership_plan_standard-1': 1,
    'membership_plan_premium-1': 1,
    'membership_plan_basic-2': 6,
    'membership_plan_standard-2': 6,
    'membership_plan_premium-2': 6,
    'membership_plan_basic-3': 12,
    'membership_plan_standard-3': 12,
    'membership_plan_premium-3': 12
  }[membershipType] || 1;

  return new Date(Date.now() + duration * 30 * 24 * 60 * 60 * 1000);
};

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: mail_user,
    pass: mail_pass
  }
});

// Generate OTP
const generateOTP = () => {
  return crypto.randomBytes(3).toString('hex'); // Generates a 6-character OTP
};

// Admin: Fetch pending registrations
app.get('/admin/registrations', async (req, res) => {
  try {
    const registrations = await User.find({ paymentConfirmed: false });
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).send('An error occurred while fetching registrations.');
  }
});

// Admin: Send OTP
app.post('/admin/send-otp', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found.');
    }
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 24 * 60 * 60 * 1000; // OTP valid for 24 hours
    await user.save();
    
    const mailOptions = {
      from: 'gamingzone3045@gmail.com',
      to: user.email,
      subject: 'Your OTP for Gym Membership Payment Confirmation',
      text: `Your OTP is ${otp}. It is valid for 24 hours.`
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending OTP.');
      }
      res.json({ message: 'OTP sent to user\'s email.' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while sending OTP.');
  }
});

// Register user
app.post('/register', async (req, res) => {
  const { name, email, password, membershipType, termsAgreed } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = calculateMembershipEndDate(membershipType);
    const newUser = new User({
      name,
      email,
      password:hashedPassword,
      membershipType,
      termsAgreed,
      membershipStartDate:Date.now(),
      membershipExpiryDate: expiryDate
    });
    const savedUser = await newUser.save();
    res.json({ userId: savedUser._id });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Confirm payment
app.post('/confirm-payment', async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found.');
    if (user.otp !== otp) return res.status(400).send('Invalid OTP.');
    if (Date.now() > user.otpExpiry) return res.status(400).send('OTP expired.');
    user.paymentConfirmed = true;
    await user.save();
    res.json({ message: 'Payment confirmed and user registration completed.' });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found.');
    if (!user.paymentConfirmed) return res.status(403).send('Payment not confirmed.');
    if (new Date() > user.membershipExpiryDate) return res.status(403).send('Membership expired.');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials.');
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
