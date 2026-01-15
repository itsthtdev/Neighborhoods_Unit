const express = require('express');
const router = express.Router();
const Collaboration = require('../models/Collaboration');
const { ensureAuthenticated, ensureMember } = require('../middleware/auth');

// Get all active collaborations
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    // Get user's associations
    const userAssociations = req.user.associations.map(a => a.associationId);
    
    const collaborations = await Collaboration.find({
      status: 'active',
      participatingAssociations: { $in: userAssociations }
    })
    .populate('createdBy.userId', 'name email')
    .populate('createdBy.associationId', 'name')
    .populate('participatingAssociations', 'name')
    .sort('-createdAt');
    
    res.json(collaborations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific collaboration
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id)
      .populate('createdBy.userId', 'name email')
      .populate('createdBy.associationId', 'name')
      .populate('participatingAssociations', 'name')
      .populate('messages.userId', 'name email')
      .populate('messages.associationId', 'name');
    
    if (!collaboration) {
      return res.status(404).json({ error: 'Collaboration not found' });
    }
    
    res.json(collaboration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new collaboration
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    // User must be member of at least one association
    if (!req.user.associations || req.user.associations.length === 0) {
      return res.status(403).json({ error: 'Must be member of an association' });
    }
    
    const collaboration = await Collaboration.create({
      ...req.body,
      createdBy: {
        userId: req.user._id,
        associationId: req.user.associations[0].associationId
      }
    });
    
    res.status(201).json(collaboration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add message to collaboration
router.post('/:id/messages', ensureAuthenticated, async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id);
    
    if (!collaboration) {
      return res.status(404).json({ error: 'Collaboration not found' });
    }
    
    // Check if user's association is participating
    const userAssociationId = req.body.associationId || req.user.associations[0].associationId;
    const isParticipating = collaboration.participatingAssociations.some(
      a => a.toString() === userAssociationId.toString()
    );
    
    if (!isParticipating) {
      return res.status(403).json({ error: 'Association not participating in this collaboration' });
    }
    
    collaboration.messages.push({
      userId: req.user._id,
      associationId: userAssociationId,
      message: req.body.message
    });
    collaboration.updatedAt = new Date();
    
    await collaboration.save();
    
    res.json(collaboration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join collaboration
router.post('/:id/join', ensureAuthenticated, async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id);
    
    if (!collaboration) {
      return res.status(404).json({ error: 'Collaboration not found' });
    }
    
    const associationId = req.body.associationId || req.user.associations[0].associationId;
    
    if (!collaboration.participatingAssociations.includes(associationId)) {
      collaboration.participatingAssociations.push(associationId);
      await collaboration.save();
    }
    
    res.json(collaboration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update collaboration status
router.put('/:id/status', ensureAuthenticated, async (req, res) => {
  try {
    const collaboration = await Collaboration.findByIdAndUpdate(
      req.params.id,
      { 
        status: req.body.status,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    res.json(collaboration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
