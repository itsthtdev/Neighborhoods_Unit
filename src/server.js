require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const connectDB = require('./config/database');
const passport = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'neighborhoods-unite-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/associations', require('./routes/associations'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/issues', require('./routes/issues'));
app.use('/api/collaborations', require('./routes/collaborations'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Neighbors Unite API is running',
    features: [
      'Multi-Association Management',
      'Role-Based User Management',
      'Document Management with Version Control',
      'Issue & Topic Tracking',
      'Inter-Association Collaboration',
      'Google OAuth Integration'
    ]
  });
});

// Serve frontend root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Neighbors Unite server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
