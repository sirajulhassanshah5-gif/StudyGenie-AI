import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export const QuizPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const quiz = {
    title: 'Computer Architecture & Assembly Quiz',
    questions: [
      {
        question: 'Which component of the CPU is responsible for performing arithmetic and logical operations?',
        options: ['Control Unit (CU)', 'Arithmetic Logic Unit (ALU)', 'Registers', 'Cache Memory'],
        correct: 1,
        explanation: 'The ALU performs all basic mathematical (add, subtract) and logical (AND, OR) operations.',
      },
      {
        question: 'What is the primary advantage of cache memory?',
        options: ['Unlimited storage capacity', 'Non-volatile storage', 'Significantly faster access speed than main RAM', 'Lowest cost per gigabyte'],
        correct: 2,
        explanation: 'Cache memory uses static RAM (SRAM) located on or near the CPU die, providing ultra-fast access to frequently used data.',
      },
      {
        question: 'In RISC architecture, instructions are typically:',
        options: ['Complex and multi-cycle', 'Simple, uniform in length, and executed in a single cycle', 'Variable byte length only', 'Microcoded exclusively'],
        correct: 1,
        explanation: 'RISC (Reduced Instruction Set Computer) focuses on simple, highly optimized single-cycle instructions.',
      },
    ],
  };

  const handleSelectOption = (index: number) => {
    if (quizSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setQuizSubmitted(true);
    if (selectedAnswer === quiz.questions[currentQuestion].correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setQuizSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizSubmitted(false);
    setIsFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center bg-white/70 dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">{quiz.title}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">AI-Generated Practice Test</p>
          </div>
        </div>

        {!isFinished && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        )}
      </div>

      {!isFinished ? (
        <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            {quiz.questions[currentQuestion].question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {quiz.questions[currentQuestion].options.map((option, idx) => {
              let isSelected = selectedAnswer === idx;
              let isCorrect = idx === quiz.questions[currentQuestion].correct;

              let style = 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 hover:border-indigo-500/40';

              if (quizSubmitted) {
                if (isCorrect) {
                  style = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-semibold';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-rose-500/10 border-rose-500/50 text-rose-400 font-semibold';
                }
              } else if (isSelected) {
                style = 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-semibold shadow-md';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                >
                  <span>{option}</span>
                  {quizSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                  {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {quizSubmitted && (
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1.5 animate-fadeIn">
              <div className="flex items-center space-x-2 text-indigo-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>AI Explanation</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {quiz.questions[currentQuestion].explanation}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            {!quizSubmitted ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center space-x-2"
              >
                <span>{currentQuestion + 1 < quiz.questions.length ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Quiz Complete! 🎉</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              You scored <strong>{score}</strong> out of <strong>{quiz.questions.length}</strong> ({Math.round((score / quiz.questions.length) * 100)}%)
            </p>
          </div>
          <Button
            onClick={handleRestart}
            className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 inline-flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </Button>
        </div>
      )}
    </div>
  );
};
