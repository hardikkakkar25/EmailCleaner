import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Chatbot from '../components/Chatbot';

export default function Home() {
  const [emails, setEmails] = useState([]);
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokensParam = urlParams.get('tokens');
    if (tokensParam) {
      const parsedTokens = JSON.parse(decodeURIComponent(tokensParam));
      console.log('Tokens:', parsedTokens); // Debug
      setTokens(parsedTokens);
      window.history.pushState({}, document.title, '/'); // Clean up URL
    }
  }, []);

  const handleAuth = () => {
    window.location.href = 'http://localhost:8000/auth/google';
  };

  const fetchEmails = async () => {
    try {
      console.log('Fetching emails with tokens:', tokens);
      const res = await axios.post('http://localhost:8000/email/classify', { tokens });
      console.log('Emails fetched:', res.data);
      setEmails(res.data);
    } catch (error) {
      console.error('Fetch error:', error.response?.data || error.message);
    }
  };

  const deleteEmails = async (ids) => {
    try {
      await axios.post('http://localhost:8000/email/delete', { tokens, emailIds: ids });
      setEmails(emails.filter(email => !ids.includes(email.id)));
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
    }
  };

  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f7fafc',
          color: '#1a202c',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ padding: '24px' }}
        >
          <h1
            style={{
              fontSize: '30px',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}
          >
            AI Email Cleaner
          </h1>

          {!tokens ? (
            <button
              onClick={handleAuth}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Connect Gmail
            </button>
          ) : (
            <>
              <button
                onClick={fetchEmails}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: '#fff',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Fetch Emails
              </button>
              <div
                style={{
                  marginTop: '24px',
                  display: 'grid',
                  gap: '16px',
                }}
              >
                {emails.map(email => (
                  <motion.div
                    key={email.id}
                    style={{
                      padding: '16px',
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <h2
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      {email.subject || 'No Subject'}
                    </h2>
                    <p
                      style={{
                        color: '#4a5568',
                        marginBottom: '8px',
                      }}
                    >
                      {email.snippet || 'No snippet available'}
                    </p>
                    <p
                      style={{
                        color: '#718096',
                        fontSize: '14px',
                      }}
                    >
                      Category: {email.category || 'Uncategorized'}
                    </p>
                    <button
                      onClick={() => deleteEmails([email.id])}
                      style={{
                        marginTop: '8px',
                        padding: '4px 12px',
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
      <Chatbot emails={emails} />
    </>
  );
}