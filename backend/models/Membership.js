const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const membershipSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "PT-Beginner", "M-Basic"
  durationInMonths: { type: Number, required: true }, // e.g., 1, 6, 12
  price: { type: Number, required: true }, // e.g., 50 (for $50)
  features: [String], // e.g., ["Access to gym", "Personal trainer", "Group classes"]
});

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;
