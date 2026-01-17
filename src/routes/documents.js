const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const { ensureAuthenticated, ensureMember } = require('../middleware/auth');

// Get documents for an association
router.get('/:associationId', ensureMember, async (req, res) => {
  try {
    const documents = await Document.find({ 
      associationId: req.params.associationId 
    })
    .populate('uploadedBy', 'name email')
    .sort('-createdAt');
    
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific document
router.get('/:associationId/:documentId', ensureMember, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.documentId,
      associationId: req.params.associationId
    }).populate('uploadedBy', 'name email');
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload new document (simplified - in production would handle actual file upload)
router.post('/:associationId', ensureMember, async (req, res) => {
  try {
    const document = await Document.create({
      ...req.body,
      associationId: req.params.associationId,
      uploadedBy: req.user._id
    });
    
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update document (creates new version)
router.put('/:associationId/:documentId', ensureMember, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.documentId,
      associationId: req.params.associationId
    });
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Save previous version
    document.previousVersions.push({
      version: document.version,
      fileUrl: document.fileUrl,
      uploadedAt: document.updatedAt,
      uploadedBy: document.uploadedBy
    });
    
    // Update document
    document.version += 1;
    document.fileUrl = req.body.fileUrl || document.fileUrl;
    document.title = req.body.title || document.title;
    document.description = req.body.description || document.description;
    document.updatedAt = new Date();
    document.uploadedBy = req.user._id;
    
    await document.save();
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete document
router.delete('/:associationId/:documentId', ensureMember, async (req, res) => {
  try {
    await Document.findOneAndDelete({
      _id: req.params.documentId,
      associationId: req.params.associationId
    });
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
