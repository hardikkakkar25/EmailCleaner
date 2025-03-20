import { useState } from 'react';

export default function Chatbot({ emails }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Simulate AI response (integrate OpenAI API here)
    setMessage(`I suggest deleting emails categorized as Promotions: ${emails.filter(e => e.category === 'Promotions').length} found.`);
  };

  return (
    <div
      style={{
        position: 'fixed', // fixed
        bottom: '16px', // bottom-4
        right: '16px', // right-4
        padding: '16px', // p-4
        backgroundColor: '#fff', // bg-white
        borderRadius: '8px', // rounded
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // shadow
      }}
    >
      <p
        style={{
          margin: '0', // Default paragraph reset
          color: '#1a202c', // Dark text for visibility
        }}
      >
        {message || 'Ask me about your emails!'}
      </p>
      <input
        type="text"
        placeholder="Type here..."
        style={{
          marginTop: '8px', // mt-2
          padding: '4px 8px', // p-1 adjusted
          border: '1px solid #e2e8f0', // border (gray-200)
          borderRadius: '4px', // rounded
          width: '100%', // Make it full-width within container
          boxSizing: 'border-box', // Ensure padding doesn’t overflow
        }}
      />
      <button
        onClick={handleSend}
        style={{
          marginTop: '8px', // mt-2
          padding: '4px 12px', // p-1 adjusted
          backgroundColor: '#3b82f6', // bg-blue-500
          color: '#fff', // text-white
          borderRadius: '4px', // rounded
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Send
      </button>
    </div>
  );
}