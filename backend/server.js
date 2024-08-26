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
const Exercise = require('./models/Exercise');
const WorkoutSession= require('./models/WorkoutSession');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const jwtSecret = process.env.JWT_SECRET;
const mongoURI = process.env.MONGO_URI;
const mailUser = process.env.EMAIL_USER;
const mailPass = process.env.EMAIL_PASS;

mongoose.connect(mongoURI);

// Calculate membership end date
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
    'membership_plan_premium-3': 12,
  }[membershipType] || 1;

  return new Date(Date.now() + duration * 30 * 24 * 60 * 60 * 1000);
};

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

// Run the seeding process
seedExercises();

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
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error.message);  // Log the exact error message
    res.status(401).send('Invalid token');
  }
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

// Register user
app.post('/register', async (req, res) => {
  const { name, email, password, membershipType, termsAgreed } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = calculateMembershipEndDate(membershipType);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      membershipType,
      termsAgreed,
      membershipStartDate: Date.now(),
      membershipExpiryDate: expiryDate,
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
// Fetch exercises for the user
app.get('/exercises', authMiddleware, async (req, res) => {
  const userId = req.user._id; // Extracted from the JWT token
  try {
    // Fetch the user with their associated exercises
    const user = await User.findById(userId).populate('exercises');
    if (!user) return res.status(404).send('User not found.');

    // Fetch the default exercises available to all users
    const defaultExercises = await Exercise.find({ createdBy: null });

    // Fetch exercises created by the specific user
    const userExercises = await Exercise.find({ createdBy: userId });
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
  const userId = req.user._id; // Get the user ID from the authMiddleware
  const { name, bodyPart, equipment, difficulty, sets, reps, restPeriod, videoUrl } = req.body;

  try {
    // Find if the exercise already exists for the user
    let exercise = await Exercise.findOne({ name, user: userId });

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
        createdBy: userId // Assign the exercise to the current user
      });
      await exercise.save();
    }

    // Find the user by their ID
    const user = await User.findById(userId);
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

// Add exercise to user's list
/*app.post('/exercises/add', authMiddleware, async (req, res) => {
  const userId = req.user._id;
  const { exerciseId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found.');
    if (!user.exercises.includes(exerciseId)) {
      user.exercises.push(exerciseId);
      await user.save();
    }
    res.json({ message: 'Exercise added to user\'s list.' });
  } catch (error) {
    res.status(500).send(error);
  }
});
*/
//save todays workout
/*Save today's workout
app.post('/workout/save', authMiddleware, async (req, res) => {
  const userId = req.user._id;
  const { name, exercises, conditions, subjectiveFeedback } = req.body;

  try {
    const workoutSession = new WorkoutSession({
      user: userId,
      name,
      exercises,
      conditions,
      subjectiveFeedback
    });

    await workoutSession.save();
    res.json({ message: 'Workout session saved successfully!', workoutSession });
  } catch (error) {
    console.error('Error saving workout session:', error);
    res.status(500).send('An error occurred while saving the workout session.');
  }
});
*/
// Save a Workout Session
app.post('/workout/save', authMiddleware,async (req, res) => {
  try {
    const { workoutName, exercises, conditions, subjectiveFeedback } = req.body;

    // Check if the user is authenticated
    const userId = req.user._id; // Assuming you have a middleware to attach the userId to the request
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Create a new workout session
    const newWorkoutSession = new WorkoutSession({
      user: userId,
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

// Remove exercise from user's list
app.post('/exercises/remove', authMiddleware, async (req, res) => {
  const userId = req.user._id;
  const { exerciseId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found.');
    user.exercises = user.exercises.filter(id => !id.equals(exerciseId));
    await user.save();
    res.json({ message: 'Exercise removed from user\'s list.' });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Fetch user's workout history
app.get('/workout/history', authMiddleware, async (req, res) => {
  const userId = req.user._id;
  
  try {
    const workoutHistory = await WorkoutSession.find({ user: userId }).sort({ date: -1 });
    res.json(workoutHistory);
  } catch (error) {
    console.error('Error fetching workout history:', error);
    res.status(500).send('An error occurred while fetching workout history.');
  }
});

// Fetch user stats
app.get('/user/stats', authMiddleware, async (req, res) => {
  const userId = req.user._id;
  
  try {
    const workoutSessions = await WorkoutSession.find({ user: userId });
    const totalWorkouts = workoutSessions.length;
    const totalTime = workoutSessions.reduce((sum, session) => sum + session.duration, 0);
    const avgDuration = totalWorkouts ? (totalTime / totalWorkouts) : 0;
    
    const userStats = {
      totalWorkouts,
      totalTime: (totalTime / 60).toFixed(2),  // Convert minutes to hours
      avgDuration: avgDuration.toFixed(2)
    };
    
    res.json(userStats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).send('An error occurred while fetching user stats.');
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
