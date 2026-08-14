import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  X, 
  Shuffle, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Sliders, 
  BookOpen, 
  RotateCcw, 
  Keyboard, 
  FileText
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { 
  generateAIFlashcards, 
  shuffleCards, 
  SAMPLE_FLASHCARD_DECKS, 
  getSavedDecks 
} from '../services/flashcardService';
import type { 
  FlashcardDeck, 
  FlashcardItem, 
  SampleFlashcardDeck 
} from '../types/flashcards';

export const FlashcardsPage: React.FC = () => {
  // Setup & Generator state
  const [inputText, setInputText] = useState<string>('');
  const [cardCount, setCardCount] = useState<number>(8);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Deck State
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [activeCards, setActiveCards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'bookmarked'>('all');
  
  // Storage / History state
  const [savedDecks, setSavedDecks] = useState<FlashcardDeck[]>([]);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState<boolean>(false);

  useEffect(() => {
    setSavedDecks(getSavedDecks());
  }, []);

  // Keyboard navigation shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!deck || activeCards.length === 0) return;
      // Don't trigger if user is typing in a textarea or input
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight') {
        handleNextCard();
      } else if (e.key === 'ArrowLeft') {
        handlePrevCard();
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.key.toLowerCase() === 'b') {
        handleToggleBookmark();
      } else if (e.key.toLowerCase() === 'm') {
        handleMarkStatus('mastered');
      } else if (e.key.toLowerCase() === 'r') {
        handleMarkStatus('learning');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deck, activeCards, currentIndex]);

  const handleGenerateDeck = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please paste study notes or select a sample topic first.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const newDeck = await generateAIFlashcards(inputText, cardCount);
      setDeck(newDeck);
      setActiveCards(newDeck.cards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setFilterMode('all');
      setSavedDecks(getSavedDecks());
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate flashcards.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectSample = (sample: SampleFlashcardDeck) => {
    setInputText(sample.contentPrompt);
    setErrorMessage(null);
  };

  const handleNextCard = () => {
    if (activeCards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % activeCards.length);
  };

  const handlePrevCard = () => {
    if (activeCards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + activeCards.length) % activeCards.length);
  };

  const handleShuffleDeck = () => {
    if (activeCards.length === 0) return;
    setIsFlipped(false);
    const shuffled = shuffleCards(activeCards);
    setActiveCards(shuffled);
    setCurrentIndex(0);
  };

  const handleToggleBookmark = () => {
    if (activeCards.length === 0) return;
    const currentCard = activeCards[currentIndex];
    const updatedCards = activeCards.map((c, i) => 
      i === currentIndex ? { ...c, isBookmarked: !c.isBookmarked } : c
    );
    setActiveCards(updatedCards);

    // Also update main deck
    if (deck) {
      setDeck({
        ...deck,
        cards: deck.cards.map(c => c.id === currentCard.id ? { ...c, isBookmarked: !c.isBookmarked } : c)
      });
    }
  };

  const handleMarkStatus = (status: 'mastered' | 'learning') => {
    if (activeCards.length === 0) return;
    const currentCard = activeCards[currentIndex];
    const updatedCards = activeCards.map((c, i) => 
      i === currentIndex ? { ...c, status } : c
    );
    setActiveCards(updatedCards);

    if (deck) {
      setDeck({
        ...deck,
        cards: deck.cards.map(c => c.id === currentCard.id ? { ...c, status } : c)
      });
    }

    // Auto advance to next card after marking
    setTimeout(() => {
      handleNextCard();
    }, 250);
  };

  const handleToggleFilterMode = () => {
    if (!deck) return;
    if (filterMode === 'all') {
      const bookmarked = deck.cards.filter(c => c.isBookmarked);
      if (bookmarked.length === 0) {
        alert('No bookmarked cards found in this deck. Click the bookmark icon on any card first!');
        return;
      }
      setActiveCards(bookmarked);
      setFilterMode('bookmarked');
      setCurrentIndex(0);
      setIsFlipped(false);
    } else {
      setActiveCards(deck.cards);
      setFilterMode('all');
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  const currentCard = activeCards[currentIndex];
  
  // Progress calculations
  const totalCards = deck?.cards.length || 0;
  const masteredCount = deck?.cards.filter(c => c.status === 'mastered').length || 0;
  const learningCount = deck?.cards.filter(c => c.status === 'learning').length || 0;
  const bookmarkedCount = deck?.cards.filter(c => c.isBookmarked).length || 0;
  const progressPercent = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Spaced Repetition
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2 flex items-center gap-3">
            Smart AI Flashcards
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Turn notes into interactive study decks with 3D flip animation, shuffle, bookmarks, and mastery progress tracking.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setShowKeyboardHelp(true)}
            title="Keyboard Shortcuts"
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {deck && (
            <Button
              onClick={() => setDeck(null)}
              variant="secondary"
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
            >
              <Sliders className="w-4 h-4 text-teal-500" />
              <span>Create New Deck</span>
            </Button>
          )}
        </div>
      </div>

      {/* SECTION 1: SETUP FORM (When no active deck) */}
      {!deck && (
        <div className="space-y-6">
          
          {/* Sample Decks */}
          <div className="bg-white/70 dark:bg-slate-900/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-teal-500" />
                Featured Sample Topics
              </span>
              <span className="text-[10px] text-slate-400">Click to fill notes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_FLASHCARD_DECKS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-slate-200/60 dark:border-slate-700/50 hover:border-teal-500/40 text-left transition-all group space-y-1"
                >
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    {sample.title}
                  </p>
                  <p className="text-[10px] text-slate-400">{sample.category}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Builder Card */}
          <div className="bg-white/70 dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-500" />
                  Paste Study Notes or Key Concepts
                </label>
                {inputText && (
                  <button
                    onClick={() => setInputText('')}
                    className="text-[10px] text-slate-400 hover:text-rose-500 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your study materials, lecture summaries, or definitions here..."
                rows={6}
                className="w-full p-4 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 font-sans leading-relaxed resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Cards Count:</span>
                <div className="flex space-x-1.5">
                  {[5, 8, 12, 15].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => setCardCount(cnt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        cardCount === cnt
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {cnt} Cards
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerateDeck}
                disabled={isGenerating || !inputText.trim()}
                className="py-3 px-8 text-xs font-bold rounded-2xl bg-gradient-to-r from-teal-500 via-indigo-600 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-white shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Extracting Flashcards...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>Generate AI Flashcard Deck</span>
                  </>
                )}
              </Button>
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-500 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{errorMessage}</p>
            )}

            {/* Saved Decks Quick Reload */}
            {savedDecks.length > 0 && (
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Saved Flashcard Decks ({savedDecks.length})</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedDecks.slice(0, 4).map((sd) => (
                    <div
                      key={sd.id}
                      onClick={() => { setDeck(sd); setActiveCards(sd.cards); setCurrentIndex(0); setIsFlipped(false); }}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 hover:border-teal-500/40 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{sd.title}</p>
                        <p className="text-[10px] text-slate-400">{sd.cards.length} cards • {sd.createdAt}</p>
                      </div>
                      <Layers className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* SECTION 2: ACTIVE FLASHCARD RUNNER */}
      {deck && activeCards.length > 0 && currentCard && (
        <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
          
          {/* Progress Tracker Bar */}
          <div className="bg-white/70 dark:bg-slate-900/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-teal-500" />
                <span className="text-slate-900 dark:text-slate-100">{deck.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-[11px]">
                  Card {currentIndex + 1} of {activeCards.length}
                </span>
                {filterMode === 'bookmarked' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] uppercase">
                    Bookmarked Only
                  </span>
                )}
              </div>
            </div>

            {/* Progress line */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-600 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / activeCards.length) * 100}%` }}
              />
            </div>

            {/* Mastery Statistics */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                <Check className="w-3.5 h-3.5" /> Mastered: {masteredCount}/{totalCards} ({progressPercent}%)
              </span>
              <span className="flex items-center gap-1 text-amber-500 font-semibold">
                <RotateCw className="w-3.5 h-3.5" /> Reviewing: {learningCount}
              </span>
              <span className="flex items-center gap-1 text-purple-400 font-semibold">
                <Bookmark className="w-3.5 h-3.5" /> Bookmarked: {bookmarkedCount}
              </span>
            </div>
          </div>

          {/* Action Toolbar (Shuffle, Bookmark Filter, Flip indicator) */}
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShuffleDeck}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all flex items-center space-x-1.5 font-medium"
              >
                <Shuffle className="w-3.5 h-3.5 text-teal-500" />
                <span>Shuffle</span>
              </button>

              <button
                onClick={handleToggleFilterMode}
                className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 font-medium ${
                  filterMode === 'bookmarked'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{filterMode === 'bookmarked' ? 'Show All' : `Bookmarked (${bookmarkedCount})`}</span>
              </button>
            </div>

            <span className="text-slate-400 text-[11px]">
              Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[10px]">Space</kbd> to flip
            </span>
          </div>

          {/* 3D FLIP CARD CONTAINER */}
          <div 
            className="perspective-1000 w-full min-h-[320px] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div 
              className={`
                w-full h-full min-h-[320px] rounded-3xl p-8 transition-transform duration-500 transform-style-3d relative flex flex-col justify-between
                bg-white/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-2xl hover:border-teal-500/50
                ${isFlipped ? 'rotate-y-180' : ''}
              `}
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              
              {/* Top Bar of Card */}
              <div 
                className="flex items-center justify-between w-full z-10"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-500 border border-teal-500/20">
                  {currentCard.category || 'Concept'}
                </span>

                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleBookmark(); }}
                  className={`p-1.5 rounded-xl transition-colors ${
                    currentCard.isBookmarked
                      ? 'text-purple-500 bg-purple-500/10'
                      : 'text-slate-400 hover:text-purple-400'
                  }`}
                  title="Bookmark Card (Key 'B')"
                >
                  {currentCard.isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
              </div>

              {/* Main Text Content */}
              <div 
                className="my-auto text-center space-y-3 py-6 px-4"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <p className="text-[11px] font-bold text-teal-500 uppercase tracking-widest">
                  {isFlipped ? 'Answer / Explanation' : 'Question / Key Term'}
                </p>
                <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                  {isFlipped ? currentCard.back : currentCard.front}
                </h2>
              </div>

              {/* Bottom Flip Indicator */}
              <div 
                className="flex items-center justify-center text-slate-400 text-xs gap-1.5 pt-4 border-t border-slate-200/50 dark:border-slate-800/50"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <RotateCw className="w-3.5 h-3.5 animate-spin-slow text-teal-500" />
                <span>{isFlipped ? 'Click or spacebar to see Question' : 'Click or spacebar to see Answer'}</span>
              </div>

            </div>
          </div>

          {/* MAIN CONTROL BAR: PREVIOUS / MASTERY / NEXT */}
          <div className="flex items-center justify-between gap-4 pt-2">
            
            {/* Previous Button */}
            <Button
              onClick={handlePrevCard}
              variant="outline"
              className="px-4 py-2.5 text-xs font-semibold rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            {/* Mastery Feedback Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleMarkStatus('learning')}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  currentCard.status === 'learning'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                }`}
              >
                <X className="w-4 h-4" />
                <span>Need Review</span>
              </button>

              <button
                onClick={() => handleMarkStatus('mastered')}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  currentCard.status === 'mastered'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Mastered!</span>
              </button>
            </div>

            {/* Next Button */}
            <Button
              onClick={handleNextCard}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white shadow-md flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

          </div>

        </div>
      )}

      {/* Keyboard Shortcuts Helper Modal */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-teal-500" />
                Keyboard Shortcuts
              </h3>
              <button 
                onClick={() => setShowKeyboardHelp(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-600 dark:text-slate-300">Flip Card</span>
                <kbd className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono text-[10px]">Space / Arrow Up</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-600 dark:text-slate-300">Next Card</span>
                <kbd className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono text-[10px]">Right Arrow →</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-600 dark:text-slate-300">Previous Card</span>
                <kbd className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono text-[10px]">← Left Arrow</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-600 dark:text-slate-300">Toggle Bookmark</span>
                <kbd className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono text-[10px]">B Key</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-600 dark:text-slate-300">Mark Mastered</span>
                <kbd className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono text-[10px]">M Key</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-600 dark:text-slate-300">Mark Need Review</span>
                <kbd className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono text-[10px]">R Key</kbd>
              </div>
            </div>

            <Button
              onClick={() => setShowKeyboardHelp(false)}
              className="w-full py-2 text-xs font-bold rounded-xl bg-teal-600 text-white"
            >
              Got it
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};
