
# EmailCleaner

**EmailCleaner** is an AI-powered email management tool that helps you classify and clean your Gmail inbox. It uses Google OAuth for authentication, fetches emails via the Gmail API, and provides a simple interface to view and delete emails, with a chatbot for email-related suggestions.

---

## Features
- **Google OAuth Sign-In:** Securely connect your Gmail account.
- **Email Fetching:** Retrieve recent emails with subjects and snippets.
- **Email Deletion:** Delete unwanted emails directly from the UI.
- **Chatbot:** Get basic suggestions about your emails (mock AI response, ready for OpenAI integration).
- **Responsive UI:** Styled with inline CSS for a clean, modern look.

---

## Tech Stack
- **Frontend:** React, Framer Motion (animations), Axios (API requests)
- **Backend:** Node.js, Express, Google APIs (Gmail)
- **Styling:** Inline CSS (previously Tailwind CSS)
- **Version Control:** Git, GitHub

---

## Prerequisites
- **Node.js:** v20+ (LTS recommended)
- **npm:** v10+ (comes with Node.js)
- **Google Cloud Project:** For OAuth credentials
- **Git:** For cloning and pushing to GitHub

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/hardikkakkar25/EmailCleaner.git
cd EmailCleaner
```

### 2. Set Up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., "EmailCleaner").
3. Enable the **Gmail API**:
   - Navigate to **APIs & Services > Library**.
   - Search for "Gmail API" and enable it.
4. Configure **OAuth Consent Screen**:
   - Go to **APIs & Services > OAuth Consent Screen**.
   - Set **User Type** to "External" and fill in required fields (e.g., App Name: "EmailCleaner", Support Email).
   - Add scope: `https://www.googleapis.com/auth/gmail.modify`.
   - Add test user: `your-email@gmail.com` (e.g., `hardikkakkar25@gmail.com`).
   - Save and keep in "Testing" mode for now.
5. Create **OAuth 2.0 Client ID**:
   - Go to **APIs & Services > Credentials**.
   - Click **Create Credentials > OAuth 2.0 Client ID**.
   - Type: **Web application**.
   - Authorized Redirect URI: `http://localhost:8000/auth/google/callback`.
   - Note the **Client ID** and **Client Secret**.

### 3. Install Dependencies
The project has two parts: `server` (backend) and `client` (frontend).

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd ../client
npm install
```

### 4. Configure Environment Variables
#### Backend (`server/.env`):
```bash
GOOGLE_CLIENT_ID=<your-client-id-from-google>
GOOGLE_CLIENT_SECRET=<your-client-secret-from-google>
PORT=8000
```

### 5. Run the Application
#### Backend
```bash
cd server
npm run dev
```
- Runs on `http://localhost:8000`.

#### Frontend
```bash
cd ../client
npm run dev
```
- Runs on `http://localhost:5173` (Vite default).

---

## Usage
1. Open `http://localhost:5173` in your browser.
2. Click **"Connect Gmail"** to sign in with your Google account.
3. Authorize the app to access your Gmail (scope: `gmail.modify`).
4. After signing in, click **"Fetch Emails"** to load recent emails.
5. View email subjects, snippets, and categories; click **"Delete"** to remove unwanted emails.
6. Use the chatbot (bottom-right) to get mock suggestions (e.g., "Delete Promotions").

---

## File Structure
```
EmailCleaner/
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   └── Chatbot.jsx # Chatbot component with inline CSS
│   │   └── index.jsx       # Main page with email UI
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── server/                 # Backend (Node.js/Express)
│   ├── routes/
│   │   ├── auth.js        # Google OAuth routes
│   │   └── emails.js      # Email fetching/classification routes
│   ├── index.js           # Express server setup
│   ├── .env               # Environment variables
│   └── package.json       # Backend dependencies
├── .gitignore             # Git ignore file
└── README.md              # This file
```

---

## Key Files

### `server/routes/auth.js`
Handles Google OAuth authentication:
```javascript
const { google } = require('googleapis');
const express = require('express');
const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:8000/auth/google/callback'
);

router.get('/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    scope: ['https://www.googleapis.com/auth/gmail.modify'],
  });
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  res.redirect(`http://localhost:5173/?tokens=${encodeURIComponent(JSON.stringify(tokens))}`);
});

module.exports = router;
```

### `server/routes/emails.js`
Fetches and classifies emails:
```javascript
const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

router.post('/classify', async (req, res) => {
  const { tokens } = req.body;
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(tokens);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const { data } = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });
  const emailIds = data.messages.map(msg => msg.id);

  const emails = await Promise.all(
    emailIds.map(async id => {
      const { data } = await gmail.users.messages.get({ userId: 'me', id });
      const subject = data.payload.headers.find(h => h.name === 'Subject')?.value || 'No Subject';
      return { id, snippet: data.snippet, subject, category: 'Miscellaneous' };
    })
  );
  res.json(emails);
});

module.exports = router;
```

### `client/src/index.jsx`
Main UI with inline CSS (see previous responses for full code).

### `client/src/components/Chatbot.jsx`
Chatbot UI with inline CSS (see previous responses for full code).

---

## Future Improvements
- **OpenAI Integration:** Replace the mock chatbot response with real AI classification using OpenAI’s API.
- **Dark Mode:** Add a toggle for dark theme with inline CSS.
- **Email Categories:** Enhance classification beyond "Miscellaneous" (e.g., Promotions, Social).
- **Error Handling:** Improve UI feedback for failed API calls.

---

## Troubleshooting
- **OAuth Errors:** Ensure `http://localhost:8000/auth/google/callback` is in Google Cloud Console’s Authorized Redirect URIs.
- **No Emails:** Check console logs (`Tokens:`, `Emails fetched:`) in DevTools and backend terminal.
- **Push Rejected:** Use a feature branch and PR due to `main` branch protection (see GitHub instructions above).

---

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to your fork (`git push origin feature/your-feature`).
5. Open a pull request.

---

## License
This project is unlicensed—feel free to use and modify it as you see fit!

---

## Contact
- **GitHub:** [hardikkakkar25](https://github.com/hardikkakkar25)
- **Email:** hardikkakkar25@gmail.com

---
