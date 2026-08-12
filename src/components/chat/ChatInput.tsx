import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
  onStop: () => void;
}

const SAMPLE_PROMPTS = [
  'Explain Gradient Descent in simple terms',
  'Derive Integration by Parts formula',
  'Write a Python Binary Search implementation',
  'What is the difference between SQL & NoSQL?',
];

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isGenerating, onStop }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-xl p-3 sm:p-4 rounded-b-3xl">
      {/* Sample Prompts Pills */}
      <div className="mb-2.5 flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {SAMPLE_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setInput(prompt);
              textareaRef.current?.focus();
            }}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-500/10 hover:text-purple-500 text-slate-600 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5 border border-slate-200/80 dark:border-slate-700/50 shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Input Box Form */}
      <form onSubmit={handleSubmit} className="relative flex items-end space-x-2">
        <div className="flex-1 relative rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 focus-within:ring-2 focus-within:ring-purple-500/50 shadow-inner">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI Study Tutor anything (Shift + Enter for new line)..."
            className="w-full px-4 py-3 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none resize-none max-h-32 leading-relaxed"
          />
        </div>

        {/* Submit or Stop Button */}
        {isGenerating ? (
          <button
            type="button"
            onClick={onStop}
            className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition-all flex-shrink-0"
            title="Stop response generation"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-40 disabled:hover:from-purple-600 disabled:hover:to-indigo-600 shadow-lg shadow-purple-500/25 transition-all flex-shrink-0"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
};
