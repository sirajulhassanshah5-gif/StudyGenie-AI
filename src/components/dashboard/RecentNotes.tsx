import React from 'react';
import { BookOpen, Sparkles, Clock, ArrowRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecentNotes: React.FC = () => {
  const navigate = useNavigate();

  const notes = [
    {
      id: '1',
      title: 'Neural Networks & Deep Learning Basics',
      subject: 'Computer Science',
      date: '2 hours ago',
      aiSummary: 'Covers perceptrons, backpropagation, and loss functions with Python code snippets.',
      tags: ['AI', 'Python', 'ML'],
    },
    {
      id: '2',
      title: 'Integration Techniques & Partial Fractions',
      subject: 'Calculus',
      date: 'Yesterday',
      aiSummary: 'Summary of integration by parts, trigonometric substitutions, and step-by-step proofs.',
      tags: ['Math', 'Calculus'],
    },
    {
      id: '3',
      title: 'Thermodynamics Laws & Heat Engines',
      subject: 'Physics',
      date: '2 days ago',
      aiSummary: 'First and second laws explained with Carnot engine efficiency formulas.',
      tags: ['Physics', 'Exams'],
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Notes</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">AI-summarized study notes</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/notes')}
          className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 flex items-center space-x-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div 
            key={note.id}
            onClick={() => navigate('/notes')}
            className="group cursor-pointer p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {note.subject}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {note.date}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
                {note.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {note.aiSummary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/40 text-[10px]">
              <div className="flex items-center space-x-1.5 text-indigo-400 font-medium">
                <Sparkles className="w-3 h-3" />
                <span>AI Summarized</span>
              </div>
              <div className="flex space-x-1">
                {note.tags.map((t, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
