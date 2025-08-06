const { OAuth2Client } = require('google-auth-library');
const { db } = require('../db');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Verify Google OAuth token and handle Super Admin login
const googleOAuthLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google OAuth token is required'
      });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Unable to retrieve email from Google account'
      });
    }

    // Check if user exists in registered_data table
    const checkUserQuery = "SELECT * FROM registered_data WHERE email = ?";
    
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error("Error checking user in MySQL:", err);
        return res.status(500).json({
          success: false,
          message: "Database error occurred"
        });
      }

      if (results.length > 0) {
        // User exists - check if they are Super Admin
        const user = results[0];
        
        if (user.roles !== 'Super-Admin') {
          return res.status(403).json({
            success: false,
            message: 'Only Super Admin can login via Google OAuth'
          });
        }

        // Update OAuth flag if not already set
        if (!user.is_oauth) {
          const updateOAuthQuery = "UPDATE registered_data SET is_oauth = 1 WHERE user_id = ?";
          db.query(updateOAuthQuery, [user.user_id], (updateErr) => {
            if (updateErr) {
              console.error("Error updating OAuth flag:", updateErr);
            }
          });
        }

        // Generate JWT token
        const jwtToken = JWT.sign({ id: user.user_id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.status(200).json({
          success: true,
          message: "Google OAuth login successful",
          user: {
            id: user.user_id,
            name: user.user_name,
            email: user.email,
            roles: user.roles,
            token: jwtToken,
            user_id: user.user_id,
            is_oauth: true
          },
        });
      } else {
        // User doesn't exist - create new Super Admin account
        const saltRounds = 10;
        // Generate a random password for OAuth users (they won't use it)
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(randomPassword, saltRounds);

        const insertUserQuery = `
          INSERT INTO registered_data (user_name, email, password, roles, status, is_oauth, created_date) 
          VALUES (?, ?, ?, 'Super-Admin', 'active', 1, NOW())
        `;

        const insertUserParams = [name || email.split('@')[0], email, hashedPassword];

        db.query(insertUserQuery, insertUserParams, (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error creating new user:", insertErr);
            return res.status(500).json({
              success: false,
              message: "Error creating user account"
            });
          }

          const newUserId = insertResult.insertId;

          // Generate JWT token for new user
          const jwtToken = JWT.sign({ id: newUserId }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });

          return res.status(201).json({
            success: true,
            message: "New Super Admin account created and logged in successfully",
            user: {
              id: newUserId,
              name: name || email.split('@')[0],
              email: email,
              roles: 'Super-Admin',
              token: jwtToken,
              user_id: newUserId,
              is_oauth: true
            },
          });
        });
      }
    });

  } catch (error) {
    console.error("Google OAuth error:", error);
    return res.status(500).json({
      success: false,
      message: "Google OAuth verification failed",
      error: error.message
    });
  }
};

// Handle OAuth callback with authorization code
const googleOAuthCallback = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }

    // Exchange authorization code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info from Google
    const userInfoResponse = await client.request({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo'
    });

    const { email, name } = userInfoResponse.data;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Unable to retrieve email from Google account'
      });
    }

    // Check if user exists in registered_data table
    const checkUserQuery = "SELECT * FROM registered_data WHERE email = ?";
    
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error("Error checking user in MySQL:", err);
        return res.status(500).json({
          success: false,
          message: "Database error occurred"
        });
      }

      if (results.length > 0) {
        // User exists - check if they are Super Admin
        const user = results[0];
        
        if (user.roles !== 'Super-Admin') {
          return res.status(403).json({
            success: false,
            message: 'Only Super Admin can login via Google OAuth'
          });
        }

        // Update OAuth flag if not already set
        if (!user.is_oauth) {
          const updateOAuthQuery = "UPDATE registered_data SET is_oauth = 1 WHERE user_id = ?";
          db.query(updateOAuthQuery, [user.user_id], (updateErr) => {
            if (updateErr) {
              console.error("Error updating OAuth flag:", updateErr);
            }
          });
        }

        // Generate JWT token
        const jwtToken = JWT.sign({ id: user.user_id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.status(200).json({
          success: true,
          message: "Google OAuth login successful",
          user: {
            id: user.user_id,
            name: user.user_name,
            email: user.email,
            roles: user.roles,
            token: jwtToken,
            user_id: user.user_id,
            is_oauth: true
          },
        });
      } else {
        // User doesn't exist - create new Super Admin account
        const saltRounds = 10;
        // Generate a random password for OAuth users (they won't use it)
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(randomPassword, saltRounds);

        const insertUserQuery = `
          INSERT INTO registered_data (user_name, email, password, roles, status, is_oauth, created_date) 
          VALUES (?, ?, ?, 'Super-Admin', 'active', 1, NOW())
        `;

        const insertUserParams = [name || email.split('@')[0], email, hashedPassword];

        db.query(insertUserQuery, insertUserParams, (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error creating new user:", insertErr);
            return res.status(500).json({
              success: false,
              message: "Error creating user account"
            });
          }

          const newUserId = insertResult.insertId;

          // Generate JWT token for new user
          const jwtToken = JWT.sign({ id: newUserId }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });

          return res.status(201).json({
            success: true,
            message: "New Super Admin account created and logged in successfully",
            user: {
              id: newUserId,
              name: name || email.split('@')[0],
              email: email,
              roles: 'Super-Admin',
              token: jwtToken,
              user_id: newUserId,
              is_oauth: true
            },
          });
        });
      }
    });

  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return res.status(500).json({
      success: false,
      message: "Google OAuth callback failed",
      error: error.message
    });
  }
};

// Get Google OAuth URL for frontend
const getGoogleAuthUrl = (req, res) => {
  try {
    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
      redirect_uri: process.env.GOOGLE_REDIRECT_URI
    });

    res.status(200).json({
      success: true,
      authUrl: authUrl
    });
  } catch (error) {
    console.error("Error generating Google auth URL:", error);
    res.status(500).json({
      success: false,
      message: "Error generating authentication URL"
    });
  }
};

module.exports = {
  googleOAuthLogin,
  googleOAuthCallback,
  getGoogleAuthUrl
};
