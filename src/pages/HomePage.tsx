import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Bot, BookOpen, HelpCircle, Layers, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Bot,
      title: 'AI Study Tutor',
      desc: 'Get instant, step-by-step explanations for complex problems in Math, Physics, CS, and Chemistry.',
    },
    {
      icon: BookOpen,
      title: 'Smart AI Notes',
      desc: 'Paste lectures or PDF text to generate structured summaries, key takeaways, and flashcards automatically.',
    },
    {
      icon: HelpCircle,
      title: 'Instant AI Quizzes',
      desc: 'Convert your syllabus into practice quizzes with detailed answer explanations.',
    },
    {
      icon: Layers,
      title: 'Flashcard Mastery',
      desc: 'Active recall & spaced repetition system powered by AI memory retention algorithms.',
    },
  ];

  return (
    <div className="space-y-12 py-4 animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>Next-Gen AI Learning Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          Supercharge Your Learning with{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            StudyGenie AI
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Your personal 24/7 AI tutor, notes summarizer, quiz generator, and study planner — built to boost your grades and save you hours every week.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            className="px-6 py-3 text-sm font-semibold rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 flex items-center space-x-2"
          >
            <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            onClick={() => navigate('/ai-chat')}
            variant="outline"
            className="px-6 py-3 text-sm font-semibold rounded-2xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span>Try AI Chat Tutor</span>
          </Button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg hover:border-indigo-500/40 hover:shadow-xl transition-all space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{f.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
