const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  longDescription: {
    type: String,
    maxlength: [2000, 'Long description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['web', 'game', 'design', 'fullstack'],
    default: 'web'
  },
  technologies: [{
    type: String,
    required: true
  }],
  image: {
    type: String,
    default: '/assets/images/project-placeholder.jpg'
  },
  images: [String],
  videoUrl: String,
  liveUrl: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  githubUrl: {
    type: String,
    match: [
      /https?:\/\/(www\.)?github\.com\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\/[-a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid GitHub URL'
    ]
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
ProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);