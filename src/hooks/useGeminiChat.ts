import { useState, useEffect, useRef, useCallback } from 'react';
import type { ChatMessage, ChatSession } from '../types/chat';
import { streamGeminiResponse, getStoredApiKey, setStoredApiKey } from '../services/geminiService';
import {
  getStoredSessions,
  createNewSession,
  updateSessionInStorage,
  deleteSessionFromStorage,
} from '../services/chatStorageService';

export function useGeminiChat(userName: string = 'Student') {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  const abortControllerRef = useRef<boolean>(false);

  // Initialize key and sessions
  useEffect(() => {
    setApiKey(getStoredApiKey());
    const stored = getStoredSessions();
    if (stored.length > 0) {
      setSessions(stored);
      setActiveSessionId(stored[0].id);
      setMessages(stored[0].messages);
    } else {
      const defaultWelcome: ChatMessage = {
        id: 'msg_initial',
        role: 'model',
        text: `Hello ${userName}! 👋 I'm **StudyGenie AI**, your intelligent study tutor.

Ask me anything about Computer Science, Mathematics, Physics, Chemistry, or paste code snippets & homework problems! How can I assist your revision today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const initialSession = createNewSession('Welcome Chat', [defaultWelcome]);
      setSessions([initialSession]);
      setActiveSessionId(initialSession.id);
      setMessages([defaultWelcome]);
    }
  }, [userName]);

  // Switch session
  const selectSession = useCallback((sessionId: string) => {
    const found = sessions.find((s) => s.id === sessionId);
    if (found) {
      setActiveSessionId(sessionId);
      setMessages(found.messages);
      setErrorMessage(null);
    }
  }, [sessions]);

  // Create new chat session
  const handleNewChat = useCallback(() => {
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'model',
      text: `Starting a new study session! 🚀 What topic would you like to explore?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const session = createNewSession('New Chat', [newMsg]);
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(session.id);
    setMessages([newMsg]);
    setErrorMessage(null);
  }, []);

  // Delete session
  const handleDeleteSession = useCallback((sessionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const remaining = deleteSessionFromStorage(sessionId);
    setSessions(remaining);
    if (activeSessionId === sessionId) {
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
        setMessages(remaining[0].messages);
      } else {
        handleNewChat();
      }
    }
  }, [activeSessionId, handleNewChat]);

  // Update stored API key
  const handleSaveApiKey = useCallback((key: string) => {
    setStoredApiKey(key);
    setApiKey(key);
    setIsApiKeyModalOpen(false);
  }, []);

  // Send message and stream response
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isGenerating) return;

      setErrorMessage(null);
      abortControllerRef.current = false;

      const userMessage: ChatMessage = {
        id: 'user_' + Date.now(),
        role: 'user',
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Auto title for session if it's 'New Chat'
      let sessionTitle = 'New Chat';
      const currentSession = sessions.find((s) => s.id === activeSessionId);
      if (currentSession) {
        sessionTitle = currentSession.title;
        if (sessionTitle === 'New Chat' || sessionTitle === 'Welcome Chat') {
          sessionTitle = text.trim().slice(0, 30) + (text.length > 30 ? '...' : '');
        }
      }

      // Create temporary placeholder for AI response
      const aiMsgId = 'ai_' + Date.now();
      const aiPlaceholder: ChatMessage = {
        id: aiMsgId,
        role: 'model',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true,
      };

      const messagesWithAiPlaceholder = [...updatedMessages, aiPlaceholder];
      setMessages(messagesWithAiPlaceholder);
      setIsGenerating(true);

      let fullResponseText = '';

      try {
        const stream = streamGeminiResponse(updatedMessages, { apiKey });

        for await (const chunk of stream) {
          if (abortControllerRef.current) {
            break;
          }
          fullResponseText += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId
                ? { ...msg, text: fullResponseText, isStreaming: true }
                : msg
            )
          );
        }

        // Finalize message state
        const finalAiMessage: ChatMessage = {
          id: aiMsgId,
          role: 'model',
          text: fullResponseText || 'No response returned.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: false,
        };

        const finalMessages = [...updatedMessages, finalAiMessage];
        setMessages(finalMessages);

        // Save session to storage
        if (activeSessionId) {
          const sessionToSave: ChatSession = {
            id: activeSessionId,
            title: sessionTitle,
            createdAt: currentSession?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: finalMessages,
          };
          updateSessionInStorage(sessionToSave);
          setSessions((prev) =>
            prev.map((s) => (s.id === activeSessionId ? sessionToSave : s))
          );
        }
      } catch (err: any) {
        const errorText = err.message || 'An error occurred while connecting to Gemini API.';
        setErrorMessage(errorText);

        const errorAiMsg: ChatMessage = {
          id: aiMsgId,
          role: 'model',
          text: `⚠️ **Error generating response:** ${errorText}\n\n*Tip: Check your Gemini API Key using the top-right button or verify your connection.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: false,
          isError: true,
        };

        const finalMessages = [...updatedMessages, errorAiMsg];
        setMessages(finalMessages);

        if (activeSessionId) {
          const sessionToSave: ChatSession = {
            id: activeSessionId,
            title: sessionTitle,
            createdAt: currentSession?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: finalMessages,
          };
          updateSessionInStorage(sessionToSave);
          setSessions((prev) =>
            prev.map((s) => (s.id === activeSessionId ? sessionToSave : s))
          );
        }
      } finally {
        setIsGenerating(false);
      }
    },
    [activeSessionId, apiKey, isGenerating, messages, sessions]
  );

  const stopStreaming = useCallback(() => {
    abortControllerRef.current = true;
    setIsGenerating(false);
  }, []);

  return {
    sessions,
    activeSessionId,
    messages,
    isGenerating,
    errorMessage,
    apiKey,
    isApiKeyModalOpen,
    setIsApiKeyModalOpen,
    selectSession,
    handleNewChat,
    handleDeleteSession,
    handleSaveApiKey,
    sendMessage,
    stopStreaming,
  };
}
