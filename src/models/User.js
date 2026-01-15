const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  associations: [{
    associationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Association'
    },
    role: {
      type: String,
      enum: ['president', 'vice_president', 'treasurer', 'area_representative', 'member'],
      default: 'member'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

module.exports = mongoose.model('User', userSchema);
