const express = require('express');
const router = express.Router();
const Association = require('../models/Association');
const User = require('../models/User');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

// Get all associations
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const associations = await Association.find({ status: 'active' });
    res.json(associations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's associations
router.get('/my-associations', ensureAuthenticated, async (req, res) => {
  try {
    const userAssociations = req.user.associations.map(a => a.associationId);
    const associations = await Association.find({ 
      _id: { $in: userAssociations },
      status: 'active'
    });
    res.json(associations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific association
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const association = await Association.findById(req.params.id);
    if (!association) {
      return res.status(404).json({ error: 'Association not found' });
    }
    res.json(association);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new association
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const association = await Association.create(req.body);
    
    // Add creator as president
    req.user.associations.push({
      associationId: association._id,
      role: 'president'
    });
    await req.user.save();
    
    res.status(201).json(association);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update association
router.put('/:id', ensureRole(['president', 'vice_president']), async (req, res) => {
  try {
    const association = await Association.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(association);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get association members
router.get('/:id/members', ensureAuthenticated, async (req, res) => {
  try {
    const users = await User.find({
      'associations.associationId': req.params.id
    }).select('name email associations');
    
    const members = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.associations.find(a => a.associationId.toString() === req.params.id).role
    }));
    
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add member to association
router.post('/:id/members', ensureRole(['president', 'vice_president']), async (req, res) => {
  try {
    const { email, role } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.associations.push({
      associationId: req.params.id,
      role: role || 'member'
    });
    await user.save();
    
    res.json({ message: 'Member added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update member role
router.put('/:id/members/:userId', ensureRole(['president']), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const association = user.associations.find(
      a => a.associationId.toString() === req.params.id
    );
    
    if (!association) {
      return res.status(404).json({ error: 'Member not found in association' });
    }
    
    association.role = req.body.role;
    await user.save();
    
    res.json({ message: 'Member role updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
