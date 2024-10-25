import { useState } from 'react';
import { Message } from '../types';

const thinkingMessages = [
  'Processing your request...',
  'Thinking...',
  'Hmm, let me check that...',
  'This is a tricky one...',
  'Hold on, almost there...'
];

export const useChatMock = () => {
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
    addMessage(query, 'user'); // Add user message
    setIsProcessing(true);
    addMessage(thinkingMessages[0], 'bot'); // Initial processing message

    // Update "thinking" message periodically while processing
    let messageIndex = 0;
    const processingInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % thinkingMessages.length;
      addMessage(thinkingMessages[messageIndex], 'bot', true); // Rotate message
    }, 1500); // Change every 1.5 seconds

    // Simulate delay for mock result
    setTimeout(() => {
      clearInterval(processingInterval); // Stop rotating messages
      setIsProcessing(false); // Processing done

      // Remove last "thinking" message before adding answer
      setMessages(prev => prev.slice(0, -1));

      // Define mock result for testing
      const mockResult = {
        answer: `Mock answer for the query: ${query}`,
        sources: ['https://example.com/source1', 'https://example.com/source2']
      };

      // Display mock answer
      addMessage(`Answer: ${mockResult.answer}`, 'bot');

      // Display sources if available
      if (mockResult.sources && mockResult.sources.length > 0) {
        addMessage('Sources:', 'bot');
        mockResult.sources.forEach((source: string) =>
          addMessage(source, 'bot')
        );
      } else {
        addMessage('No sources available.', 'bot');
      }
    }, 8000); // Mock delay of 8 seconds
  };

  return { messages, sendMessage, isProcessing };
};
