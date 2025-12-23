// backend/models/Medicine.js
const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number}, // Storing as String since it has '₹' in the name, but Number is better if data is clean
  is_discontinued: { type: Boolean, default: false },
  manufacturer_name: { type: String },
  type: { type: String },
  pack_size_label: { type: String },
  short_composition1: { type: String },
  short_composition2: { type: String },
  // We will store the pipe-separated values as Arrays for easier searching
  uses: { type: [String] },
  side_effects: { type: [String] },
  substitutes: { type: [String] },
  chemical_class: { type: String },
  habit_forming: { type: String }, // Or Boolean if the data is just 'Yes'/'No'
  therapeutic_class: { type: String },
  action_class: { type: String },
});

// Create a text index for fuzzy searching on 'name' and 'uses'
medicineSchema.index({ name: 'text', uses: 'text' });

const Medicine = mongoose.model('Medicine', medicineSchema);
module.exports = Medicine;