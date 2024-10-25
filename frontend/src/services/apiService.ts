import axios from 'axios';
import { PollResult } from '../types';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const sendQuery = async (
  query: string
): Promise<{ task_id: string }> => {
  try {
    const response = await axios.post(
      `${apiUrl}/ask`,
      { query },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error during API call:', error);
    throw new Error('Failed to fetch response from server');
  }
};

export const pollQueryResult = async (
  taskId: string,
  interval: number = 2000, // Poll every 2 seconds
  duration: number = 300000 // 5 minutes in milliseconds
): Promise<PollResult> => {
  const maxAttempts = Math.floor(duration / interval);
  let attempts = 0;

  const poll = async (
    resolve: (result: PollResult) => void,
    reject: (error: Error) => void
  ) => {
    try {
      const response = await axios.get(`${apiUrl}/result/${taskId}`);
      const { status, result, error } = response.data;

      if (status === 'completed') {
        resolve(result);
      } else if (status === 'failed' || status === 'terminated') {
        reject(new Error(`Task ${status}: ${error || 'No further details'}`));
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(() => poll(resolve, reject), interval);
      } else {
        reject(new Error('Polling timed out after 5 minutes'));
      }
    } catch (error) {
      console.error('Error during polling:', error);
      reject(new Error('Failed to poll result'));
    }
  };

  return new Promise<PollResult>(poll);
};
