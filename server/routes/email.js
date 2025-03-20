const express = require('express');
const { google } = require('googleapis');
const { OpenAI } = require('openai');
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/classify', async (req, res) => {
  const { tokens, emailIds } = req.body;
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(tokens);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const emails = await Promise.all(emailIds.map(async (id) => {
    const { data } = await gmail.users.messages.get({ userId: 'me', id });
    return { id, snippet: data.snippet, subject: data.payload.headers.find(h => h.name === 'Subject')?.value };
  }));

  const classifications = await Promise.all(emails.map(async (email) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Classify this email as Important, Promotions, Social, or Unanswered: ${email.subject} - ${email.snippet}` }],
    });
    return { ...email, category: response.choices[0].message.content };
  }));

  res.json(classifications);
});

router.post('/delete', async (req, res) => {
    const { tokens, emailIds } = req.body;
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  
    await Promise.all(emailIds.map(id => gmail.users.messages.trash({ userId: 'me', id })));
    res.json({ success: true });
  });

module.exports = router;