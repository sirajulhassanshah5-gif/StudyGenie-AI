export type Role = 'user' | 'model' | 'system';

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface GeminiConfig {
  apiKey?: string;
  model?: string;
  systemInstruction?: string;
  temperature?: number;
}

export interface StreamChunk {
  text: string;
  done: boolean;
}
