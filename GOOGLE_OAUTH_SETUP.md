# Google OAuth Integration for Super Admin Login

This document explains how to set up and use the Google OAuth integration for Super Admin login in the CRM system.

## 🚀 Features

- **Super Admin Only**: Only users with Super Admin role can login via Google OAuth
- **Auto Registration**: If a Gmail account is not registered, it automatically creates a Super Admin account
- **Seamless Integration**: Works alongside existing authentication without breaking current functionality
- **Secure**: Uses Google Identity Services and JWT tokens for authentication

## 📋 Prerequisites

1. **Google Cloud Console Setup**: 
   - The Google OAuth credentials are already configured in the `.env` file


2. **Database Setup**:
   - The `registered_data` table must exist with OAuth support
   - Run the migration script to ensure proper table structure

## 🛠️ Installation Steps

### 1. Install Dependencies

**Server Dependencies:**
```bash
cd server
npm install google-auth-library
```

**Client Dependencies:**
The client uses Google Identity Services (no additional npm packages needed).

### 2. Database Migration

Run the database migration to ensure the `registered_data` table exists with OAuth support:

```bash
cd server
node runMigration.js
```

This will:
- Create the `registered_data` table if it doesn't exist
- Add the `is_oauth` column for OAuth users
- Add necessary timestamp columns

### 3. Environment Configuration

The Google OAuth credentials are already added to the server `.env` file:

```env
# Google OAuth Configuration

```

## 🎯 How It Works

### Authentication Flow

1. **User clicks "Sign in with Google"** on the Super Admin login page
2. **Google Identity Services** handles the OAuth flow
3. **Backend receives the credential token** and verifies it with Google
4. **User verification**:
   - If user exists and is Super Admin → Login successful
   - If user exists but not Super Admin → Access denied
   - If user doesn't exist → Create new Super Admin account
5. **JWT token generated** and user redirected to dashboard

### Database Schema

The `registered_data` table structure:

```sql
CREATE TABLE `registered_data` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `roles` enum('Super-Admin', 'Admin', 'Employee') NOT NULL DEFAULT 'Super-Admin',
  `status` enum('active', 'inactive') NOT NULL DEFAULT 'active',
  `is_oauth` tinyint(1) NOT NULL DEFAULT 0,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
);
```

## 🔧 API Endpoints

### 1. Google OAuth Login
- **Endpoint**: `POST /api/google-oauth-login`
- **Body**: `{ "token": "google_credential_token" }`
- **Response**: User data with JWT token

### 2. Google OAuth Callback (Alternative)
- **Endpoint**: `POST /api/google-oauth-callback`
- **Body**: `{ "code": "authorization_code" }`
- **Response**: User data with JWT token

### 3. Get Google Auth URL
- **Endpoint**: `GET /api/google-auth-url`
- **Response**: `{ "authUrl": "google_oauth_url" }`

## 🎨 Frontend Components

### 1. GoogleOAuthButton Component
- Located: `client/src/components/GoogleOAuthButton.jsx`
- Renders Google Sign-In button
- Handles OAuth flow and token verification

### 2. GoogleOAuthCallback Component
- Located: `client/src/components/GoogleOAuthCallback.jsx`
- Handles OAuth callback (alternative flow)
- Shows loading state during authentication

### 3. Updated SuperAdminLogin
- Located: `client/src/components/SuperAdminLogin.jsx`
- Includes Google OAuth button below regular login form
- Maintains all existing functionality

## 🔒 Security Features

1. **Role Verification**: Only Super Admin accounts can use OAuth
2. **Token Validation**: Google tokens are verified server-side
3. **JWT Security**: Secure JWT tokens with 7-day expiration
4. **Database Security**: Hashed passwords for OAuth users
5. **CORS Protection**: Configured for localhost:3000

## 🚦 Usage Instructions

### For Super Admins:

1. **Go to Super Admin Login page**: `/SuperAdmin-login`
2. **Choose login method**:
   - Use existing email/password (traditional login)
   - Click "Sign in with Google" button (OAuth login)
3. **Google OAuth Flow**:
   - Select your Google account
   - Grant permissions
   - Automatically redirected to dashboard

### For Developers:

1. **Testing OAuth**: Use any Gmail account - it will create a Super Admin account
2. **Existing Users**: Current Super Admin accounts can use OAuth if they use the same email
3. **Role Management**: Only Super Admin role is allowed via OAuth

## 🐛 Troubleshooting

### Common Issues:

1. **"Only Super Admin can login via Google OAuth"**
   - Solution: The Gmail account is registered but not as Super Admin
   - Fix: Update the user's role in the database to 'Super-Admin'

2. **Database connection errors**
   - Solution: Run the migration script: `node runMigration.js`
   - Ensure MySQL is running and credentials are correct

3. **Google OAuth errors**
   - Check browser console for detailed error messages
   - Verify Google credentials in `.env` file
   - Ensure redirect URI matches Google Cloud Console settings

4. **Token verification failed**
   - Check server logs for detailed error information
   - Verify Google Client ID and Secret are correct

## 📝 Notes

- **Backward Compatibility**: All existing authentication methods continue to work
- **No Breaking Changes**: Existing users and functionality remain unchanged
- **OAuth Flag**: Users who login via OAuth have `is_oauth = 1` in the database
- **Password**: OAuth users get a random password (they won't use it)

## 🔄 Future Enhancements

Potential improvements for future versions:
- Support for other OAuth providers (Microsoft, GitHub, etc.)
- Role-based OAuth restrictions configuration
- OAuth user management interface
- Enhanced security features (2FA, session management)

---

**Important**: This integration is specifically designed for Super Admin access only. Regular Admin and Employee users should continue using the traditional login methods.
