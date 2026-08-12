import type { ChatSession, ChatMessage } from '../types/chat';

const STORAGE_KEY = 'study_genie_chat_sessions_v1';

export const getStoredSessions = (): ChatSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatSession[];
  } catch (e) {
    console.error('Failed to parse chat sessions from storage:', e);
    return [];
  }
};

export const saveSessionsToStorage = (sessions: ChatSession[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save chat sessions to storage:', e);
  }
};

export const createNewSession = (title: string = 'New Conversation', initialMessages: ChatMessage[] = []): ChatSession => {
  const newSession: ChatSession = {
    id: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: initialMessages,
  };
  const sessions = getStoredSessions();
  const updated = [newSession, ...sessions];
  saveSessionsToStorage(updated);
  return newSession;
};

export const updateSessionInStorage = (updatedSession: ChatSession): void => {
  const sessions = getStoredSessions();
  const idx = sessions.findIndex((s) => s.id === updatedSession.id);
  if (idx !== -1) {
    sessions[idx] = {
      ...updatedSession,
      updatedAt: new Date().toISOString(),
    };
  } else {
    sessions.unshift(updatedSession);
  }
  saveSessionsToStorage(sessions);
};

export const deleteSessionFromStorage = (sessionId: string): ChatSession[] => {
  const sessions = getStoredSessions();
  const filtered = sessions.filter((s) => s.id !== sessionId);
  saveSessionsToStorage(filtered);
  return filtered;
};
