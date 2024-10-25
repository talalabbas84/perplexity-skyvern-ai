export interface Message {
  text: string;
  type: 'user' | 'bot';
}

export interface QueryResponse {
  answer: string;
}


// Adjusted to reflect correct result type
export interface PollResult {
  answer: string;
  sources: string[] | null;
}