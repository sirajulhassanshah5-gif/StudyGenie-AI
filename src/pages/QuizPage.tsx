import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RefreshCw, 
  Sparkles, 
  ArrowRight,
  Sliders,
  RotateCcw,
  BookOpen,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { 
  generateAIQuiz, 
  evaluateShortAnswer, 
  calculateQuizScore, 
  SAMPLE_QUIZ_TOPICS 
} from '../services/quizService';
import type { 
  QuizConfig, 
  GeneratedQuiz, 
  UserAnswerRecord, 
  QuestionDifficulty
} from '../types/quiz';

export const QuizPage: React.FC = () => {
  // Config state
  const [config, setConfig] = useState<QuizConfig>({
    topic: 'Computer Architecture & Assembly Language',
    difficulty: 'medium',
    questionType: 'mixed',
    questionCount: 5
  });

  // Generator & Quiz State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);

  // Active Test State
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswerRecord>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [shortInputText, setShortInputText] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

  const handleGenerateQuiz = async () => {
    if (!config.topic.trim()) {
      setErrorMessage('Please enter a study topic or select a sample topic.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const generated = await generateAIQuiz(config);
      setQuiz(generated);
      setCurrentStep(0);
      setUserAnswers({});
      setSelectedOption(null);
      setShortInputText('');
      setIsAnswerSubmitted(false);
      setIsQuizComplete(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTopicSample = (prompt: string) => {
    setConfig(prev => ({ ...prev, topic: prompt }));
    setErrorMessage(null);
  };

  const handleSubmitCurrentAnswer = () => {
    if (!quiz) return;
    const currentQ = quiz.questions[currentStep];

    if (currentQ.type === 'short_question') {
      if (!shortInputText.trim()) return;
      const evalResult = evaluateShortAnswer(shortInputText, currentQ.modelAnswer, currentQ.keyKeywords);
      setUserAnswers(prev => ({
        ...prev,
        [currentQ.id]: {
          questionId: currentQ.id,
          shortAnswerText: shortInputText,
          scoreAwarded: evalResult.score,
          feedback: evalResult.feedback,
          isCorrect: evalResult.score >= 0.7
        }
      }));
    } else {
      if (selectedOption === null) return;
      const isCorrect = selectedOption === currentQ.correctAnswerIndex;
      setUserAnswers(prev => ({
        ...prev,
        [currentQ.id]: {
          questionId: currentQ.id,
          selectedIndex: selectedOption,
          isCorrect: isCorrect,
          scoreAwarded: isCorrect ? 1 : 0
        }
      }));
    }

    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    if (currentStep + 1 < quiz.questions.length) {
      setCurrentStep(prev => prev + 1);
      const nextQ = quiz.questions[currentStep + 1];
      const existingRecord = userAnswers[nextQ.id];
      if (existingRecord) {
        setSelectedOption(existingRecord.selectedIndex ?? null);
        setShortInputText(existingRecord.shortAnswerText || '');
        setIsAnswerSubmitted(true);
      } else {
        setSelectedOption(null);
        setShortInputText('');
        setIsAnswerSubmitted(false);
      }
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentStep(0);
    setUserAnswers({});
    setSelectedOption(null);
    setShortInputText('');
    setIsAnswerSubmitted(false);
    setIsQuizComplete(false);
  };

  const currentQ = quiz?.questions[currentStep];
  const scoreStats = quiz ? calculateQuizScore(quiz.questions, userAnswers) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Powered Practice
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2 flex items-center gap-3">
            Interactive AI Quiz Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate custom MCQs, True/False, and Short Answer questions on any subject with instant AI evaluation and score reports.
          </p>
        </div>

        {quiz && (
          <Button
            onClick={() => setQuiz(null)}
            variant="secondary"
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 self-start sm:self-auto"
          >
            <Sliders className="w-4 h-4 text-indigo-500" />
            <span>New Quiz</span>
          </Button>
        )}
      </div>

      {/* SECTION 1: QUIZ SETUP FORM (If no quiz active) */}
      {!quiz && (
        <div className="space-y-6">
          
          {/* Preset Sample Topics */}
          <div className="bg-white/70 dark:bg-slate-900/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Featured Study Topics
              </span>
              <span className="text-[10px] text-slate-400">Click to load topic</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_QUIZ_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopicSample(topic.topicPrompt)}
                  className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/60 dark:border-slate-700/50 hover:border-indigo-500/40 text-left transition-all group flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {topic.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{topic.category}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Builder Form Card */}
          <div className="bg-white/70 dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
            
            {/* Topic Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>Quiz Topic / Notes Content</span>
                {config.topic && (
                  <button 
                    onClick={() => setConfig({ ...config, topic: '' })}
                    className="text-[10px] text-slate-400 hover:text-rose-500 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                )}
              </label>
              <textarea
                value={config.topic}
                onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                placeholder="Type any subject (e.g. Organic Chemistry, Quantum Physics, World History, JavaScript Promises) or paste lecture notes..."
                rows={4}
                className="w-full p-4 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-sans leading-relaxed resize-none"
              />
            </div>

            {/* Config Selectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Difficulty Selector (Easy, Medium, Hard) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Difficulty Level</label>
                <div className="flex flex-col space-y-1.5">
                  {[
                    { id: 'easy', label: 'Easy 🌱', desc: 'Foundational facts' },
                    { id: 'medium', label: 'Medium ⚡', desc: 'Conceptual understanding' },
                    { id: 'hard', label: 'Hard 🔥', desc: 'Critical scenarios' },
                  ].map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => setConfig({ ...config, difficulty: diff.id as QuestionDifficulty })}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        config.difficulty === diff.id
                          ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <p className="text-xs">{diff.label}</p>
                      <p className="text-[10px] opacity-75">{diff.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Question Type Selector (MCQs, True/False, Short Questions, Mixed) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Question Types</label>
                <div className="flex flex-col space-y-1.5">
                  {[
                    { id: 'mixed', label: '✨ All Types (Mixed)', desc: 'MCQs, True/False & Short' },
                    { id: 'mcq', label: '📋 MCQs Only', desc: '4 Multiple Choice options' },
                    { id: 'true_false', label: '⚖️ True / False', desc: 'Binary statement checks' },
                    { id: 'short_question', label: '✍️ Short Questions', desc: 'Open text response' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setConfig({ ...config, questionType: type.id as any })}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        config.questionType === type.id
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <p className="text-xs">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Question Count */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Number of Questions</label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => setConfig({ ...config, questionCount: cnt })}
                      className={`py-3 rounded-xl text-xs font-extrabold border transition-all ${
                        config.questionCount === cnt
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 pt-2">
                  Gemini will compose {config.questionCount} {config.difficulty} difficulty questions tailored to your topic.
                </p>
              </div>

            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Generate Action Button */}
            <Button
              onClick={handleGenerateQuiz}
              disabled={isGenerating || !config.topic.trim()}
              className="w-full py-3.5 text-xs font-bold rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Gemini AI Composing Quiz...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>Generate AI Quiz</span>
                </>
              )}
            </Button>

          </div>
        </div>
      )}

      {/* SECTION 2: ACTIVE QUIZ RUNNER (If quiz active & not complete) */}
      {quiz && !isQuizComplete && currentQ && (
        <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
          
          {/* Progress Header */}
          <div className="bg-white/70 dark:bg-slate-900/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{quiz.title}</h3>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                  <span className="uppercase font-bold text-amber-500">{quiz.difficulty}</span>
                  <span>•</span>
                  <span>Question {currentStep + 1} of {quiz.questions.length}</span>
                </div>
              </div>
            </div>

            {/* Type badge */}
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase">
              {currentQ.type === 'mcq' ? 'MCQ' : currentQ.type === 'true_false' ? 'True / False' : 'Short Question'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-indigo-600 h-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
            
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {currentStep + 1}. {currentQ.question}
            </h2>

            {/* CASE A: MCQ & True/False Choices */}
            {(currentQ.type === 'mcq' || currentQ.type === 'true_false') && currentQ.options && (
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctAnswerIndex;

                  let style = 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 hover:border-indigo-500/40';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      style = 'bg-emerald-500/10 border-emerald-500/60 text-emerald-600 dark:text-emerald-400 font-bold';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-500/10 border-rose-500/60 text-rose-600 dark:text-rose-400 font-bold';
                    }
                  } else if (isSelected) {
                    style = 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold shadow-md';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !isAnswerSubmitted && setSelectedOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                      {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* CASE B: Short Question Text Input */}
            {currentQ.type === 'short_question' && (
              <div className="space-y-3">
                <textarea
                  value={shortInputText}
                  onChange={(e) => !isAnswerSubmitted && setShortInputText(e.target.value)}
                  disabled={isAnswerSubmitted}
                  placeholder="Type your response here..."
                  rows={4}
                  className="w-full p-4 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
                />

                {isAnswerSubmitted && userAnswers[currentQ.id] && (
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-500">AI Feedback & Score</span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold">
                        Score: {Math.round((userAnswers[currentQ.id].scoreAwarded || 0) * 100)}%
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{userAnswers[currentQ.id].feedback}</p>
                    {currentQ.modelAnswer && (
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        <strong>Model Answer:</strong> {currentQ.modelAnswer}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* AI Explanation Box (When submitted) */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1.5 animate-fadeIn">
                <div className="flex items-center space-x-2 text-indigo-500 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Explanation</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex justify-end pt-4 border-t border-slate-200/60 dark:border-slate-800">
              {!isAnswerSubmitted ? (
                <Button
                  onClick={handleSubmitCurrentAnswer}
                  disabled={currentQ.type === 'short_question' ? !shortInputText.trim() : selectedOption === null}
                  className="px-6 py-3 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-md disabled:opacity-50"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md flex items-center space-x-2"
                >
                  <span>{currentStep + 1 < quiz.questions.length ? 'Next Question' : 'View Final Score'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>

          </div>

        </div>
      )}

      {/* SECTION 3: FINAL SCORE & RESULTS SCREEN */}
      {quiz && isQuizComplete && scoreStats && (
        <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
          
          {/* Final Score Hero Card */}
          <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-indigo-500/20 border border-indigo-500/30 text-indigo-500 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase tracking-wider">
                {quiz.topic} ({quiz.difficulty})
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
                Quiz Submission Complete! 🎉
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Here is your detailed performance breakdown.
              </p>
            </div>

            {/* Score Ring / Big Percentage */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 inline-block px-12">
              <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {scoreStats.percentage}%
              </p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
                Score: {scoreStats.totalScore} / {scoreStats.maxScore}
              </p>
            </div>

            {/* Score Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {scoreStats.mcqCount > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                  <p className="text-[10px] uppercase font-bold text-slate-400">MCQs Score</p>
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {scoreStats.mcqCorrect} / {scoreStats.mcqCount}
                  </p>
                </div>
              )}
              {scoreStats.trueFalseCount > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                  <p className="text-[10px] uppercase font-bold text-slate-400">True / False Score</p>
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {scoreStats.trueFalseCorrect} / {scoreStats.trueFalseCount}
                  </p>
                </div>
              )}
              {scoreStats.shortCount > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Short Questions Score</p>
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {scoreStats.shortScoreTotal} / {scoreStats.shortCount}
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button
                onClick={handleRetakeQuiz}
                variant="secondary"
                className="px-6 py-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake Same Quiz</span>
              </Button>

              <Button
                onClick={() => setQuiz(null)}
                className="px-6 py-3 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-md inline-flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate New Quiz</span>
              </Button>
            </div>

          </div>

          {/* Question-by-Question Review List */}
          <div className="bg-white/70 dark:bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Question-by-Question Answer Key & Explanations
            </h3>

            <div className="space-y-4">
              {quiz.questions.map((q, idx) => {
                const rec = userAnswers[q.id];
                const isCorrect = rec?.isCorrect;

                return (
                  <div 
                    key={q.id}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      isCorrect 
                        ? 'bg-emerald-500/5 border-emerald-500/30' 
                        : 'bg-rose-500/5 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                          {q.question}
                        </h4>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        isCorrect 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                        {isCorrect ? 'Correct' : 'Needs Review'}
                      </span>
                    </div>

                    {/* Question type specific review details */}
                    {q.type !== 'short_question' && q.options && (
                      <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300 pl-8">
                        <p>
                          <strong>Your Answer:</strong> {typeof rec?.selectedIndex === 'number' ? q.options[rec.selectedIndex] : 'No response'}
                        </p>
                        <p className="text-emerald-600 dark:text-emerald-400">
                          <strong>Correct Answer:</strong> {typeof q.correctAnswerIndex === 'number' ? q.options[q.correctAnswerIndex] : ''}
                        </p>
                      </div>
                    )}

                    {q.type === 'short_question' && (
                      <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300 pl-8">
                        <p><strong>Your Answer:</strong> "{rec?.shortAnswerText || 'No response'}"</p>
                        <p className="text-indigo-500"><strong>Model Answer:</strong> "{q.modelAnswer}"</p>
                      </div>
                    )}

                    <p className="text-xs text-slate-500 dark:text-slate-400 pl-8 italic">
                      💡 {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
