import { useState } from 'react';
import { pollQueryResult, sendQuery } from '../services/apiService';
import { Message } from '../types';

const thinkingMessages = [
  'Processing your request...',
  'Thinking...',
  'Hmm, let me check that...',
  'This is a tricky one...',
  'Hold on, almost there...'
];

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addMessage = (
    text: string,
    type: 'user' | 'bot',
    updateLast: boolean = false
  ) => {
    setMessages(prev => {
      if (updateLast && prev.length > 0) {
        return [...prev.slice(0, -1), { text, type }];
      } else {
        return [...prev, { text, type }];
      }
    });
  };

  const sendMessage = async (query: string) => {
    addMessage(query, 'user'); 
    setIsProcessing(true);
    addMessage(thinkingMessages[0], 'bot'); 

    let messageIndex = 0;
    const processingInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % thinkingMessages.length;
      addMessage(thinkingMessages[messageIndex], 'bot', true); 
    }, 10000);

    try {
      const { task_id } = await sendQuery(query); 
      console.log('task_id:', task_id);

      const result = await pollQueryResult(task_id);
      console.log('Result:', result);

      clearInterval(processingInterval); 
      setIsProcessing(false); 

      setMessages(prev => prev.slice(0, -1));

      if (result.answer) {
        addMessage(`Answer: ${result.answer}`, 'bot');
      }

      if (result.sources && result.sources.length > 0) {
        addMessage('Sources:', 'bot');
        result.sources.forEach((source: string) => addMessage(source, 'bot'));
      } else {
        addMessage('No sources available.', 'bot');
      }
    } catch (error) {
      clearInterval(processingInterval); 
      setIsProcessing(false); 

      setMessages(prev => prev.slice(0, -1));

      addMessage('Error: Unable to get a response.', 'bot');
    }
  };

  return { messages, sendMessage, isProcessing };
};
