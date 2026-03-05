const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true
  },
  clientPosition: String,
  clientCompany: String,
  clientImage: String,
  content: {
    type: String,
    required: true,
    maxlength: 300
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  projectType: String,
  featured: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);