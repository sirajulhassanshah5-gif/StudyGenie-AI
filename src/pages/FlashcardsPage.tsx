import React, { useState } from 'react';
import { Layers, RotateCw, ArrowLeft, ArrowRight, Sparkles, Check, X } from 'lucide-react';
import { Button } from '../components/common/Button';

export const FlashcardsPage: React.FC = () => {
  const [flipped, setFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const deck = [
    {
      question: 'What is the time complexity of QuickSort in the average vs worst case?',
      answer: 'Average Case: O(N log N)\nWorst Case: O(N²) (occurs when pivot choice leads to unbalanced partitions)',
      category: 'Algorithms',
    },
    {
      question: 'What is the First Law of Thermodynamics?',
      answer: 'Energy cannot be created or destroyed, only transformed from one form to another: ΔU = Q - W',
      category: 'Physics',
    },
    {
      question: 'What does ACID stand for in Database Systems?',
      answer: 'Atomicity, Consistency, Isolation, Durability',
      category: 'Database Systems',
    },
  ];

  const card = deck[currentIndex];

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center bg-white/70 dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Smart AI Flashcards</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Spaced repetition revision</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Card {currentIndex + 1} of {deck.length}
        </span>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="cursor-pointer min-h-[300px] p-8 rounded-3xl bg-white/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-2xl hover:border-indigo-500/50 transition-all flex flex-col justify-between relative group"
      >
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {card.category}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
            <RotateCw className="w-3.5 h-3.5" /> Click to flip
          </span>
        </div>

        <div className="my-8 text-center space-y-4">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
            {flipped ? 'Answer' : 'Question'}
          </p>
          <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
            {flipped ? card.answer : card.question}
          </h2>
        </div>

        <div className="flex justify-center items-center text-xs text-slate-400">
          <span>{flipped ? 'Showing Answer' : 'Showing Question'}</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrev}
          variant="outline"
          className="px-4 py-2 text-xs font-semibold rounded-xl border-slate-300 dark:border-slate-700 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <div className="flex space-x-2">
          <button className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold flex items-center gap-1">
            <X className="w-4 h-4" /> Need Review
          </button>
          <button className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
            <Check className="w-4 h-4" /> Mastered
          </button>
        </div>

        <Button
          onClick={handleNext}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center space-x-2"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
