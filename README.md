# Neighborhoods Unite

**Eugene Neighborhood Associations Collaboration Platform**

A comprehensive web application for neighborhood associations in Eugene to manage their internal operations and collaborate with each other.

## Overview

This platform serves approximately 10 neighborhood associations in Eugene, providing tools for:
- Multi-association management with independent operations
- Role-based user management (President, VP, Treasurer, Area Reps, Members)
- Document management with version control
- Issue and topic tracking
- Inter-association collaboration
- Google Workspace integration
- Leadership succession management

## Core Features

### 🏛️ Multi-Association Management
- Each neighborhood association operates as a separate entity
- Associations can sign up and create their own accounts
- Support for smooth leadership transitions

### 👥 Role-Based User Management
- **President/Chair**: Full administrative access
- **Vice President**: Administrative access
- **Treasurer**: Financial document access
- **Area Representatives**: Regional management
- **General Members**: Basic access
- Permissions align with roles

### 📄 Document Management
- Store and organize association documents
- Version control and document history
- Easy access for current leadership
- Secure storage with appropriate permissions

### 📋 Issue & Topic Tracking
- Track what neighbors are saying/reporting
- Manage topics that need attention
- Track items for city communication
- Action item management with assignments

### 🤝 Inter-Association Collaboration
- Open portal/messaging system between associations
- Collaborate on shared initiatives
- Discussion forums for cross-association coordination

### 🔗 Integrations
- **Google Workspace**: OAuth authentication, Drive, Calendar
- **Email Platforms**: MailChimp and others
- **Eugene Neighborhood Inc**: Fund management connection

### 🔄 Account Succession
- Seamless leadership transitions
- New officers inherit access to all resources
- Historical documents transfer automatically
- No loss of institutional knowledge

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Google Cloud Console project (for OAuth)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/itsthtdev/Neighborhoods_Unit.git
cd Neighborhoods_Unit
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Configure Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
   - Copy Client ID and Client Secret to `.env`

5. Start MongoDB:
```bash
# Using MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

6. Start the server:
```bash
npm start
```

7. Open your browser and visit: `http://localhost:3000`

## Development

To run the development server:
```bash
npm run dev
```

## Project Structure

```
Neighborhoods_Unit/
├── src/
│   ├── server.js              # Main Express server
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── passport.js        # Authentication config
│   ├── models/
│   │   ├── User.js            # User model
│   │   ├── Association.js     # Association model
│   │   ├── Document.js        # Document model
│   │   ├── Issue.js           # Issue tracking model
│   │   └── Collaboration.js   # Collaboration model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── associations.js    # Association management
│   │   ├── documents.js       # Document management
│   │   ├── issues.js          # Issue tracking
│   │   └── collaborations.js  # Inter-association collaboration
│   └── middleware/
│       └── auth.js            # Authentication middleware
├── public/
│   ├── index.html             # Main HTML file
│   ├── styles.css             # Styles
│   └── app.js                 # Client-side JavaScript
├── tests/                     # Test files
├── .env.example               # Environment variables template
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/current` - Get current user

### Associations
- `GET /api/associations` - List all associations
- `GET /api/associations/my-associations` - User's associations
- `GET /api/associations/:id` - Get specific association
- `POST /api/associations` - Create new association
- `PUT /api/associations/:id` - Update association
- `GET /api/associations/:id/members` - Get members
- `POST /api/associations/:id/members` - Add member
- `PUT /api/associations/:id/members/:userId` - Update member role

### Documents
- `GET /api/documents/:associationId` - List documents
- `GET /api/documents/:associationId/:documentId` - Get document
- `POST /api/documents/:associationId` - Upload document
- `PUT /api/documents/:associationId/:documentId` - Update document (new version)
- `DELETE /api/documents/:associationId/:documentId` - Delete document

### Issues
- `GET /api/issues/:associationId` - List issues
- `GET /api/issues/:associationId/:issueId` - Get issue
- `POST /api/issues/:associationId` - Create issue
- `PUT /api/issues/:associationId/:issueId` - Update issue
- `POST /api/issues/:associationId/:issueId/comments` - Add comment
- `PUT /api/issues/:associationId/:issueId/notify-city` - Mark for city notification

### Collaborations
- `GET /api/collaborations` - List all collaborations
- `GET /api/collaborations/:id` - Get collaboration
- `POST /api/collaborations` - Create collaboration
- `POST /api/collaborations/:id/messages` - Add message
- `POST /api/collaborations/:id/join` - Join collaboration
- `PUT /api/collaborations/:id/status` - Update status

### Health Check
- `GET /api/health` - API status and features

## Technical Considerations

- **Web-based**: Accessible from any modern browser
- **User-friendly**: Designed for non-technical community volunteers
- **Secure**: Role-based access control and data privacy
- **Scalable**: MongoDB-based architecture supports growth
- **Integrated**: Google Workspace and email platform connections

## Security

- Google OAuth 2.0 authentication
- Session-based authentication with secure cookies
- Role-based access control (RBAC)
- Data separation between associations
- Secure password handling (bcrypt)

## Future Enhancements

- Google Drive direct integration
- Google Calendar event sync
- MailChimp campaign management
- Eugene Neighborhood Inc fund tracking
- Mobile application
- Real-time notifications
- Advanced reporting and analytics

## License

ISC

## Support

For support, please contact the Eugene Neighborhood Inc or open an issue in this repository.
 
