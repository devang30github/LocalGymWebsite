const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSessionSchema = new mongoose.Schema({
  user: { type: String, ref: 'User', required: true },
  name:{type:String,required:true},
  date: { type: Date, default: Date.now },
  exercises: [{
    exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    weight: { type: Number, required: true },
    duration: { type: Number, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true }
  }],
  conditions: {
    timeOfDay: { type: String, required: true },
    sleepHours: { type: Number, required: true },
    hydrationLevel: { type: Number, required: true }
  },
  subjectiveFeedback: {
    energyLevel: { type: Number, required: true },
    muscleSoreness: { type: Number, required: true }
  }
});

const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);
module.exports = WorkoutSession;
