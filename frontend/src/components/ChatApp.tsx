import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import './ChatApp.css';

const ChatApp: React.FC = () => {
  const { messages, sendMessage, isProcessing } = useChat();
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() && !isProcessing) {
      setInput(''); 
      await sendMessage(input); 
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !isProcessing && !e.shiftKey) {
      e.preventDefault(); 
      handleSend(); 
    }
  };

  return (
    <div className='chat-container'>
      <div className='chat-box'>
        <div className='messages'>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className='input-section'>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)} 
            placeholder='Ask AI...'
            disabled={isProcessing} 
            onKeyPress={handleKeyPress} 
            className='input-textarea' 
            rows={3}
          />
          <button onClick={handleSend} disabled={isProcessing}>
            {isProcessing ? 'Sending...' : 'Send'} 
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
