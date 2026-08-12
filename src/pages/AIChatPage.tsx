import React, { useState, useRef, useEffect } from 'react';
import { Bot, Key, Menu, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGeminiChat } from '../hooks/useGeminiChat';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { ChatMessageItem } from '../components/chat/ChatMessageItem';
import { ChatInput } from '../components/chat/ChatInput';
import { ApiKeyModal } from '../components/chat/ApiKeyModal';

export const AIChatPage: React.FC = () => {
  const { profile } = useAuth();
  const userName = profile?.name ? profile.name.split(' ')[0] : 'Student';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const {
    sessions,
    activeSessionId,
    messages,
    isGenerating,
    apiKey,
    isApiKeyModalOpen,
    setIsApiKeyModalOpen,
    selectSession,
    handleNewChat,
    handleDeleteSession,
    handleSaveApiKey,
    sendMessage,
    stopStreaming,
  } = useGeminiChat(userName);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  return (
    <div className="h-[calc(100vh-6rem)] flex rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden animate-fadeIn">
      {/* Reusable History Sidebar */}
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={selectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50/30 dark:bg-slate-950/30">
        {/* Chat Header */}
        <div className="p-3.5 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Open history sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {activeSession?.title || 'StudyGenie AI Tutor'}
                </h2>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-semibold border border-emerald-500/20">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Powered by Gemini API • STEM & Academic Assistant
              </p>
            </div>
          </div>

          {/* Top Bar Action Buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all border ${
                apiKey
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20 hover:bg-purple-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20 animate-pulse'
              }`}
              title="Configure Gemini API Key"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {apiKey ? 'API Key Set' : 'Set API Key'}
              </span>
            </button>
          </div>
        </div>

        {/* Messages Stream Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
                Welcome to StudyGenie AI
              </h3>
              <p className="text-xs max-w-sm">
                Ask any question to get instant step-by-step explanations, code examples, formulas, and revision guides.
              </p>
            </div>
          ) : (
            messages.map((msg) => <ChatMessageItem key={msg.id} message={msg} />)
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <ChatInput
          onSendMessage={sendMessage}
          isGenerating={isGenerating}
          onStop={stopStreaming}
        />
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentApiKey={apiKey}
        onSave={handleSaveApiKey}
      />
    </div>
  );
};
