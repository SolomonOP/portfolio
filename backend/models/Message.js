const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 'Please add a valid phone number']
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    maxlength: 200
  },
  message: {
    type: String,
    required: [true, 'Please add your message'],
    maxlength: 2000
  },
  projectType: {
    type: String,
    enum: ['web', 'design', 'game', 'consulting', 'other'],
    default: 'other'
  },
  budget: {
    type: String,
    enum: ['<1000', '1000-5000', '5000-10000', '10000+', 'not-specified'],
    default: 'not-specified'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  readAt: Date,
  repliedAt: Date
});

module.exports = mongoose.model('Message', MessageSchema);