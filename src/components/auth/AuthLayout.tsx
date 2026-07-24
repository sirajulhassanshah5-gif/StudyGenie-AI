import React from 'react';
import { Sparkles, Brain, GraduationCap, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 dark:bg-indigo-600/25 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 dark:bg-purple-600/25 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      {/* Main Grid Wrapper */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen w-full z-10">
        
        {/* Left Side: Brand & Feature Showcase (Hidden on Mobile, 5 Cols on Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/80 relative overflow-hidden">
          
          {/* Subtle Grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

          {/* Top Brand Mark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                StudyGenie AI
              </span>
              <span className="block text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">
                Intelligent Study Assistant
              </span>
            </div>
          </div>

          {/* Middle Content */}
          <div className="my-auto space-y-8 max-w-md">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                <Zap className="w-3.5 h-3.5" />
                <span>Supercharge Your Learning</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                Turn your notes into <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">mastery effortlessly</span>.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Join thousands of students using AI to generate instant quizzes, smart flashcards, and personalized study schedules.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3.5">
              {[
                { icon: Brain, label: 'RAG AI Assistant trained on your uploaded documents' },
                { icon: GraduationCap, label: 'Spaced repetition flashcards for 98.4% retention' },
                { icon: CheckCircle2, label: 'Instant auto-generated quizzes from notes & PDFs' },
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5 shrink-0">
                    <feat.icon className="w-4 h-4" />
                  </div>
                  <span>{feat.label}</span>
                </div>
              ))}
            </div>

            {/* Testimonial Quote Card */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md space-y-2">
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                {'★'.repeat(5)}
                <span className="text-slate-400 text-[11px] ml-2">5.0 by 12,000+ Students</span>
              </div>
              <p className="text-xs text-slate-300 italic">
                &ldquo;StudyGenie saved me during finals week. The AI generated quizzes straight from my lecture slides!&rdquo;
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                  AK
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Alex K.</p>
                  <p className="text-[10px] text-slate-400">Pre-Med Student</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-bit Encrypted & Privacy Protected</span>
          </div>
        </div>

        {/* Right Side: Form Container (7 Cols on Desktop) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-slate-950 dark:bg-slate-950 relative">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between w-full max-w-md mx-auto">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base text-white">StudyGenie AI</span>
            </div>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>

          {/* Center Form Card */}
          <div className="my-auto w-full max-w-md mx-auto py-8">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {subtitle}
              </p>
            </div>

            {children}
          </div>

          {/* Footer Copyright */}
          <div className="text-center text-xs text-slate-600 dark:text-slate-500">
            &copy; {new Date().getFullYear()} StudyGenie AI. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
};
