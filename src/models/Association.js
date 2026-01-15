const mongoose = require('mongoose');

const associationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  googleWorkspaceEnabled: {
    type: Boolean,
    default: false
  },
  emailPlatform: {
    type: String,
    enum: ['mailchimp', 'other', 'none'],
    default: 'none'
  },
  emailPlatformConfig: {
    type: Map,
    of: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
});

module.exports = mongoose.model('Association', associationSchema);
