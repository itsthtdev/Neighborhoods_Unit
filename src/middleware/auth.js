// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// Middleware to check if user has specific role in association
const ensureRole = (roles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const associationId = req.params.associationId || req.body.associationId;
    const userAssociation = req.user.associations.find(
      a => a.associationId.toString() === associationId
    );

    if (!userAssociation || !roles.includes(userAssociation.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Middleware to check if user is member of association
const ensureMember = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const associationId = req.params.associationId || req.body.associationId;
  const isMember = req.user.associations.some(
    a => a.associationId.toString() === associationId
  );

  if (!isMember) {
    return res.status(403).json({ error: 'Not a member of this association' });
  }

  next();
};

module.exports = {
  ensureAuthenticated,
  ensureRole,
  ensureMember
};
