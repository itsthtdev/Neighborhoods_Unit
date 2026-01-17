const mongoose = require('mongoose');

const collaborationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    associationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Association',
      required: true
    }
  },
  participatingAssociations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Association'
  }],
  type: {
    type: String,
    enum: ['discussion', 'initiative', 'event', 'resource_sharing'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  messages: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    associationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Association'
    },
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Collaboration', collaborationSchema);
