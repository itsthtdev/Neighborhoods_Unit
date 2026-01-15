const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const { ensureAuthenticated, ensureMember } = require('../middleware/auth');

// Get issues for an association
router.get('/:associationId', ensureMember, async (req, res) => {
  try {
    const { status, priority } = req.query;
    const query = { associationId: req.params.associationId };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    const issues = await Issue.find(query)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort('-createdAt');
    
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific issue
router.get('/:associationId/:issueId', ensureMember, async (req, res) => {
  try {
    const issue = await Issue.findOne({
      _id: req.params.issueId,
      associationId: req.params.associationId
    })
    .populate('reportedBy', 'name email')
    .populate('assignedTo', 'name email')
    .populate('comments.userId', 'name email');
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new issue
router.post('/:associationId', ensureMember, async (req, res) => {
  try {
    const issue = await Issue.create({
      ...req.body,
      associationId: req.params.associationId,
      reportedBy: req.user._id
    });
    
    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update issue
router.put('/:associationId/:issueId', ensureMember, async (req, res) => {
  try {
    const issue = await Issue.findOneAndUpdate(
      {
        _id: req.params.issueId,
        associationId: req.params.associationId
      },
      { 
        ...req.body,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment to issue
router.post('/:associationId/:issueId/comments', ensureMember, async (req, res) => {
  try {
    const issue = await Issue.findOne({
      _id: req.params.issueId,
      associationId: req.params.associationId
    });
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    issue.comments.push({
      userId: req.user._id,
      comment: req.body.comment
    });
    issue.updatedAt = new Date();
    
    await issue.save();
    
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark issue for city notification
router.put('/:associationId/:issueId/notify-city', ensureMember, async (req, res) => {
  try {
    const issue = await Issue.findOneAndUpdate(
      {
        _id: req.params.issueId,
        associationId: req.params.associationId
      },
      { 
        needsCityNotification: true,
        status: 'needs_city_communication',
        updatedAt: new Date()
      },
      { new: true }
    );
    
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
