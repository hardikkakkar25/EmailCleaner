const { google } = require('googleapis');
const express = require('express');
const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:5173/auth/google/callback' // Matches Google Cloud Console
);

router.get('/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    scope: ['https://www.googleapis.com/auth/gmail.modify'],
  });
  console.log('Auth URL:', url);
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log('Tokens fetched:', tokens); // Debug
    res.redirect(`http://localhost:5173/?tokens=${encodeURIComponent(JSON.stringify(tokens))}`);
  } catch (error) {
    console.error('Callback Error:', error);
    res.status(400).json({ success: false, error: 'Authentication failed' });
  }
});

module.exports = router;