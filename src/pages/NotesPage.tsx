import React, { useState } from 'react';
import { BookOpen, Plus, Search, Sparkles, Tag, FileText, Trash2, Edit3, Check } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [notes, setNotes] = useState([
    {
      id: '1',
      title: 'Neural Networks & Deep Learning',
      subject: 'Computer Science',
      content: 'A neural network is a method in artificial intelligence that teaches computers to process data in a way that is inspired by the human brain...',
      aiSummary: 'Summary of perceptrons, backpropagation algorithms, activation functions (ReLU, Sigmoid), and gradient descent optimization.',
      date: '2026-07-25',
      tags: ['AI', 'ML', 'Python'],
    },
    {
      id: '2',
      title: 'Calculus: Integration by Parts & Partial Fractions',
      subject: 'Math',
      content: 'Integration by parts is a technique derived from the product rule of differentiation: ∫ u dv = uv - ∫ v du...',
      aiSummary: 'Step-by-step formula breakdowns, integration of trigonometric powers, and partial fraction decomposition cases.',
      date: '2026-07-24',
      tags: ['Calculus', 'Math'],
    },
    {
      id: '3',
      title: 'Organic Chemistry: Reaction Mechanisms',
      subject: 'Chemistry',
      content: 'Nucleophilic substitution reactions (SN1 vs SN2) depend on carbocation stability, solvent type, and nucleophile strength...',
      aiSummary: 'Key differences between SN1 and SN2 pathways, stereochemistry inversion, and rate equations.',
      date: '2026-07-22',
      tags: ['Chemistry', 'Exams'],
    },
  ]);

  const categories = ['All', 'Computer Science', 'Math', 'Chemistry', 'Physics'];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || n.subject === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-500" />
            AI Notes Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organize, search, and generate instant AI summaries for your study materials.
          </p>
        </div>

        <Button className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create AI Note</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/70 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                  {note.subject}
                </span>
                <span className="text-slate-400 text-[11px]">{note.date}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">{note.title}</h3>

              {/* AI Summary Box */}
              <div className="p-3 rounded-2xl bg-indigo-500/5 dark:bg-indigo-950/40 border border-indigo-500/20 text-xs space-y-1">
                <div className="flex items-center space-x-1.5 text-indigo-400 font-semibold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Summary</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{note.aiSummary}</p>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">{note.content}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
              <div className="flex space-x-1">
                {note.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px]">
                    #{t}
                  </span>
                ))}
              </div>
              <div className="flex space-x-2 text-slate-400">
                <button className="hover:text-indigo-400 transition-colors"><Edit3 className="w-4 h-4" /></button>
                <button className="hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
