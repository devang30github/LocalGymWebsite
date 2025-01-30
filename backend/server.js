const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Membership = require('./models/Membership');
const Exercise = require('./models/Exercise');
const WorkoutSession= require('./models/WorkoutSession');
const ContactMessage=require('./models/ContactMessage');
const Admin=require('./models/Admin');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const jwtSecret = process.env.JWT_SECRET;
const mongoURI = process.env.MONGO_URI;
const mailUser = process.env.EMAIL_USER;
const mailPass = process.env.EMAIL_PASS;

mongoose.connect(mongoURI);

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: mailUser,
    pass: mailPass,
  },
});

// Generate OTP
const generateOTP = () => crypto.randomBytes(3).toString('hex');

// Seed default exercises
const seedExercises = async () => {
  try {
    const exercisesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/Exercise.json'), 'utf-8'));
    for (const exerciseData of exercisesData) {
      const existingExercise = await Exercise.findOne({ name: exerciseData.name });
      if (!existingExercise) {
        const newExercise = new Exercise(exerciseData);
        await newExercise.save();
        console.log(`Exercise "${newExercise.name}" has been seeded successfully!`);
      }
    }
  } catch (error) {
    console.error('Error seeding exercises:', error);
  }
};


const seedMemberships = async () => {
  try {
    const membershipsFilePath = path.join(__dirname, 'data/Membership.json'); // Adjust path if needed
    const membershipsData = JSON.parse(fs.readFileSync(membershipsFilePath, 'utf8'));

    for (const membership of membershipsData) {
      // Check if the membership already exists
      const exists = await Membership.findOne({ name: membership.name });

      if (exists) {
        continue; // Skip the current membership if it already exists
      }

      // Insert the membership if it does not exist
      await Membership.create(membership);
      console.log(`Membership plan "${membership.name}" seeded successfully.`);
    }

  } catch (error) {
    console.error('Error seeding membership data:', error);
  }
};
// Seed Admin Account
async function seedAdminAccount() {
  const email = 'gamingzone3045@gmail.com';
  const password = 'admin123';

  const existingAdmin = await Admin.findOne({ email });
  if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new Admin({ email, password: hashedPassword });
      await admin.save();
      console.log('Admin account created:', email);
  } else {
    console.log('Admin account already exists:', email);
}
}


// Run the seeding process
seedExercises();
seedMemberships();
seedAdminAccount();

// Authentication Middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Authorization header missing');
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).send('User not found');
    }
    req.user = { email: user.email };
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error.message);  // Log the exact error message
    res.status(401).send('Invalid token');
  }
};
/*
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Authorization header missing');
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, jwtSecret);

    // Fetch the user/admin based on the role in the decoded token
    const user = await User.findById(decoded.id);
    const admin = await Admin.findById(decoded.id);

    if (!user && !admin) {
      return res.status(401).send('User or Admin not found');
    }

    // Attach role and email to the request object
    if (user) {
      req.user = { email: user.email, role: 'user' };
    } else if (admin) {
      req.user = { email: admin.email, role: 'admin' };
    }

    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error.message); // Log the exact error message
    res.status(401).send('Invalid token');
  }
};

*/
const AdminauthMiddleware = async (req, res, next) => {
  const AdminauthHeader = req.headers.authorization;

  if (!AdminauthHeader) {
    return res.status(401).send('Authorization header missing');
  }

  const AdminToken = AdminauthHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(AdminToken, jwtSecret);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).send('User not found');
    }
    req.user = { email: admin.email };
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error.message);  // Log the exact error message
    res.status(401).send('Invalid token');
  }
};
// Register user
app.post('/register', async (req, res) => {
  const { name, email, password, membershipType, termsAgreed } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    //const expiryDate = calculateMembershipEndDate(membershipType);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      membershipType,
      termsAgreed,
    });
    const savedUser = await newUser.save();

    // Link default exercises to the new user
    const defaultExercises = await Exercise.find();
    savedUser.exercises = defaultExercises.map(exercise => exercise._id);
    await savedUser.save();

    res.json({ userId: savedUser._id });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Confirm payment
app.post('/confirm-payment', async (req, res) => {
  const { userId, otp,membershipTypeId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found.');
    if (user.otp !== otp) return res.status(400).send('Invalid OTP.');
    if (Date.now() > user.otpExpiry) return res.status(400).send('OTP expired.');
    user.paymentConfirmed = true;
    // Link the membership type
    const membership = await Membership.findById(membershipTypeId);
    if (!membership) {
      return res.status(400).json({ message: 'Invalid membership type' });
    }
    user.membershipType = membership._id; // Set single membership type
    user.membershipStartDate = new Date();
    user.membershipExpiryDate = new Date(new Date().setMonth(new Date().getMonth() + membership.durationInMonths));

    await user.save();
    res.json({ message: 'Payment confirmed and user registration completed.' });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to fetch all memberships
app.get('/memberships', async (req, res) => {
  try {
    const memberships = await Membership.find(); // Fetch all memberships
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching memberships', error });
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
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '2h' });
    res.json({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});
/*
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password.');

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid email or password.');

    // Check payment confirmation
    if (!user.paymentConfirmed) return res.status(403).send('Payment not confirmed.');

    // Check membership expiry
    if (new Date() > user.membershipExpiryDate) return res.status(403).send('Membership expired.');

    

    // Generate JWT with user info and role
    const usertoken = jwt.sign(
      { id: user._id, role: 'user', email: user.email },
      jwtSecret,
      { expiresIn: '2h' }
    );

    // Respond with token and user role
    res.json({ token:usertoken });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).send('An unexpected error occurred. Please try again later.');
  }
});
*/


// Fetch exercises for the user
app.get('/exercises', authMiddleware, async (req, res) => {
  const userEmail = req.user.email; // Extracted from the JWT token
  try {
    // Fetch the user with their associated exercises
    const user = await User.findOne({email:userEmail}).populate('exercises');
    if (!user) return res.status(404).send('User not found.');

    // Fetch the default exercises available to all users
    const defaultExercises = await Exercise.find({ createdBy: null });

    // Fetch exercises created by the specific user
    const userExercises = await Exercise.find({ createdBy: userEmail});
    /*const userExercises = user.exercises.filter(exercise => 
      exercise.createdBy.equals(userId)
    );*/

    // Combine the default exercises with the user's exercises
    const allExercises = [...defaultExercises, ...userExercises];

    res.json(allExercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new exercise to the user's list or create a new exercise and assign it to the user
app.post('/exercises/add', authMiddleware, async (req, res) => {
  const userEmail = req.user.email; // Get the user ID from the authMiddleware
  const { name, bodyPart, equipment, difficulty, sets, reps, restPeriod, videoUrl } = req.body;

  try {
    // Find if the exercise already exists for the user
    let exercise = await Exercise.findOne({ name, createdBy: userEmail });

    // If exercise doesn't exist, create a new one
    if (!exercise) {
      exercise = new Exercise({
        name,
        bodyPart,
        equipment,
        difficulty,
        sets,
        reps,
        restPeriod,
        videoUrl,
        createdBy: userEmail // Assign the exercise to the current user
      });
      await exercise.save();
    }

    // Find the user by their ID
    const user = await User.findOne({email:userEmail});
    if (!user) return res.status(404).send('User not found.');

    // If the exercise is not already in the user's list, add it
    if (!user.exercises.includes(exercise._id)) {
      user.exercises.push(exercise._id);
      await user.save();
    }

    res.json({ message: 'Exercise added to user\'s list.', exercise });
  } catch (error) {
    console.error('Error adding exercise:', error);
    res.status(500).send('An error occurred while adding the exercise.');
  }
});

// Save a Workout Session
app.post('/workout/save', authMiddleware,async (req, res) => {
  try {
    const { workoutName, exercises, conditions, subjectiveFeedback } = req.body;

    // Check if the user is authenticated
    const userEmail = req.user.email; // Assuming you have a middleware to attach the userId to the request
    if (!userEmail) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Create a new workout session
    const newWorkoutSession = new WorkoutSession({
      user: userEmail,
      name: workoutName,
      exercises: exercises.map(ex => ({
        ...ex,
        exerciseId: ex._id,
        weight: ex.weight||0,
        duration: ex.duration||0,
        sets: ex.sets,
        reps: ex.reps,
      })),
      conditions: {
        timeOfDay: conditions.timeOfDay,
        sleepHours: conditions.sleepHours,
        hydrationLevel: conditions.hydrationLevel,
      },
      subjectiveFeedback: {
        energyLevel: subjectiveFeedback.energyLevel,
        muscleSoreness: subjectiveFeedback.muscleSoreness,
      }
    });

    // Save the workout session to the database
    await newWorkoutSession.save();

    res.status(201).json({ message: 'Workout saved successfully!' });
  } catch (err) {
    console.error('Error saving workout:', err);
    res.status(500).json({ message: 'Error saving workout', error: err.message });
  }
});

// workout-history
app.get('/history',authMiddleware, async (req, res) => {
  const userEmail = req.user.email;
  try {
    // Assuming req.user.email contains the user's email
    const workoutHistory = await WorkoutSession.find({ user: userEmail }) // Use email for user identification
      .populate('exercises.exerciseId', 'name') // Populate exerciseId with the exercise name
      .exec();

    res.json(workoutHistory);
  } catch (err) {
    console.error('Error fetching workout history:', err);
    res.status(500).json({ message: 'Error fetching workout history' });
  }
});

// Route to handle contact form submission
app.post('/api/contact', async (req, res) => {
  try {
      const { name, email, subject, message } = req.body;

      // Validate input
      if (!name || !email || !subject || !message) {
          return res.status(400).json({ error: 'All fields are required' });
      }

      // Save the message to the database
      const newMessage = new ContactMessage({ name, email, subject, message });
      await newMessage.save();

      res.status(200).json({ message: 'Contact message submitted successfully' });
  } catch (error) {
      console.error('Error submitting contact message:', error);
      res.status(500).json({ error: 'An error occurred while submitting the contact message' });
  }
});

// Admin Login Route
/*
app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).send('Admin not found.');
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials.');
    }
    const adminToken = jwt.sign({ id: admin._id }, jwtSecret, { expiresIn: '2h' });
    res.json({ adminToken });
  } catch (error) {
    res.status(500).send('Error in admin login');
  }
});
*/
app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).send('Invalid email or password.');
    }
    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).send('Invalid email or password.');
    }
    // Generate JWT with admin details
    const AdminToken = jwt.sign({ id: admin._id, email: admin.email },jwtSecret,{ expiresIn: '2h' });
    // Respond with the token
    res.json({ token: AdminToken });
  } catch (error) {
    console.error('Error in admin login:', error.message);
    res.status(500).send('An unexpected error occurred. Please try again later.');
  }
});


// Admin: Fetch pending registrations
app.get('/admin/registrations',async (req, res) => {
  try {
    // Fetch registrations where payment is not confirmed and populate membershipType
    const registrations = await User.find({ paymentConfirmed: false }).populate('membershipType');
    
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).send('An error occurred while fetching registrations.');
  }
});

// Admin: Send OTP
app.post('/admin/send-otp',async (req, res) => {
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
      from: mailUser,
      to: user.email,
      subject: 'Your OTP for Gym Membership Payment Confirmation',
      text: `Your OTP is ${otp}. It is valid for 24 hours.`,
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


// Admin: Delete registration request
app.delete('/admin/delete-request/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send('User not found.');
    }
    res.json({ message: 'Registration request deleted successfully.' });
  } catch (error) {
    console.error('Error deleting registration request:', error);
    res.status(500).send('An error occurred while deleting the registration request.');
  }
});


app.post('/admin/send-renewal-notification', async (req, res) => {
  const { userId } = req.body;

  try {
    // Fetch the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    // Check if the membership is expiring within the next 7 days
    const today = new Date();
    const expiryDate = new Date(user.membershipExpiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry > 7) {
      return res.status(400).send('Membership is not expiring within the next 7 days.');
    }

    // Email content for renewal notification
    const mailOptions = {
      from: mailUser,
      to: user.email,
      subject: 'Membership Renewal Reminder',
      text: `Dear ${user.name},\n\nYour gym membership is set to expire on ${expiryDate.toDateString()}. 
We value your commitment to fitness and encourage you to renew your membership to continue enjoying our facilities and services.\n\n
Please visit our website or contact us to renew your membership before it expires.\n\n
Thank you for being part of our community!\n\nBest regards,\GymPro Manager`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending renewal notification.');
      }
      res.json({ message: 'Membership renewal notification sent to user\'s email.' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while sending renewal notification.');
  }
});

app.get('/admin/active-users',async (req, res) => {
  try {
    // Fetch registrations where payment is not confirmed and populate membershipType
    const activeUsers = await User.find({ paymentConfirmed: true }).populate('membershipType');
    
    res.json(activeUsers);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).send('An error occurred while fetching registrations.');
  }
});

app.get('/admin/dashboard-summary', async (req, res) => {
  try {
    // Get the start and end of the current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

    // Total users count
    const totalUsers = await User.countDocuments();

    // Fetch users who purchased memberships this month
    const usersWithMembershipsThisMonth = await User.find({
      membershipStartDate: { $gte: startOfMonth, $lt: endOfMonth },
    }).populate('membershipType'); // Ensure 'membershipType' is populated

    // Calculate total monthly revenue by summing up the price of each user's membership
    const monthlyRevenue = usersWithMembershipsThisMonth.reduce((total, user) => {
      return total + (user.membershipType?.price || 0);
    }, 0);

    // New registrations in the last 30 days
    const last30Days = new Date(new Date().setDate(new Date().getDate() - 30));
    const newRegistrations = await User.countDocuments({
      membershipStartDate: { $gte: last30Days },
    });

    res.json({
      totalUsers,
      monthlyRevenue,
      newRegistrations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Get paginated contact messages
app.get('/admin/contact-messages', async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 messages per page

  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 }) // Sort by most recent first
      .skip((page - 1) * limit) // Skip documents for pagination
      .limit(parseInt(limit)); // Limit the number of documents

    const totalMessages = await ContactMessage.countDocuments();

    res.json({
      messages,
      totalMessages,
      totalPages: Math.ceil(totalMessages / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
