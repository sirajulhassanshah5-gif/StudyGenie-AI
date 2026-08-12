import React, { useState } from 'react';
import { Bot, User, Copy, Check, Sparkles } from 'lucide-react';
import type { ChatMessage } from '../../types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  return (
    <div
      className={`group flex items-start space-x-3 mb-4 animate-fadeIn ${
        isUser ? 'flex-row-reverse space-x-reverse' : ''
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-md transition-transform group-hover:scale-105 ${
          isUser
            ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-indigo-500/20'
            : 'bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 shadow-purple-500/20'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Message Content Container */}
      <div className={`max-w-2xl flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Header Metadata */}
        <div className="flex items-center space-x-2 mb-1 px-1 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {isUser ? 'You' : 'StudyGenie AI'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Bubble */}
        <div
          className={`relative p-4 rounded-2xl text-xs sm:text-sm shadow-sm transition-all border ${
            isUser
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none border-indigo-500/30'
              : message.isError
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-800 rounded-tl-none'
              : 'bg-white/80 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/60 rounded-tl-none backdrop-blur-md'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
          ) : (
            <div className="relative">
              <MarkdownRenderer content={message.text} />
              
              {/* Typing Animation / Streaming Cursor Indicator */}
              {message.isStreaming && (
                <div className="inline-flex items-center space-x-1.5 mt-2 px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span className="font-medium text-[11px]">AI is generating...</span>
                  <span className="inline-block w-1.5 h-3 bg-purple-500 rounded-full animate-bounce" />
                </div>
              )}
            </div>
          )}

          {/* Copy Message Action Button */}
          {!message.isStreaming && message.text && (
            <button
              onClick={handleCopyMessage}
              title="Copy message"
              className={`absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                isUser
                  ? 'bg-indigo-700/50 hover:bg-indigo-700 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
