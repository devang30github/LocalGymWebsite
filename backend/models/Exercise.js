const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new mongoose.Schema({
  name: String,
  bodyPart: String,
  equipment: String,
  difficulty: String,
  sets: Number,
  reps: Number,
  restPeriod: String,
  videoUrl: String,
  createdBy: { type: String, ref: 'User' }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
