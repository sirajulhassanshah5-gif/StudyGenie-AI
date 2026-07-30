import React, { useState } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIChatPage: React.FC = () => {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello ${user?.name.split(' ')[0] || 'there'}! I'm your AI Study Tutor. Ask me any topic in Computer Science, Math, Physics, Chemistry, or upload your homework question!`,
      timestamp: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    'Explain Gradient Descent in simple terms',
    'Derive the formula for Integration by Parts',
    'What is the difference between SN1 and SN2 reactions?',
    'Give me 3 practice questions on CPU Scheduling',
  ];

  const handleSend = (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let responseText = `Here is a structured explanation for **"${messageText}"**:\n\n1. **Core Concept:** This fundamental topic forms the foundation for advanced problem solving.\n2. **Key Equation / Definition:** Ensure you understand the underlying axioms and state variables.\n3. **Example Application:** Apply this step-by-step in your revision deck!`;
      
      if (messageText.toLowerCase().includes('gradient descent')) {
        responseText = `**Gradient Descent** is an optimization algorithm used to minimize the loss function in machine learning.\n\nImagine walking down a foggy mountain (the loss surface) to reach the lowest valley (minimum loss):\n- You look at the slope (gradient) under your feet.\n- You take a step in the direction of steepest descent.\n- The step size is determined by your **Learning Rate (α)**.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl overflow-hidden animate-fadeIn">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              StudyGenie AI Tutor
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                Online
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Powered by advanced AI for STEM education</p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs ${
                msg.sender === 'user'
                  ? 'bg-indigo-600'
                  : 'bg-gradient-to-tr from-purple-600 to-pink-500 shadow-md shadow-purple-500/20'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              {msg.text}
              <p className={`text-[9px] mt-2 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Bot className="w-4 h-4 text-purple-400 animate-spin" />
            <span>AI Tutor is thinking...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="px-6 py-2 border-t border-slate-200/50 dark:border-slate-800/50 flex space-x-2 overflow-x-auto">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-600 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            placeholder="Ask AI study tutor anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white disabled:opacity-50 hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
