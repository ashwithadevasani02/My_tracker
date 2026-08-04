import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  ArrowLeft,
  Eye,
  ExternalLink,
  Code2,
  Database,
  Sparkles,
  Award,
  Layers,
  Copy,
  Check,
} from 'lucide-react';

export default function RevisionViewer({ flashcards = [], onReviseCard }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const [reviewedCount, setReviewedCount] = useState(0);
  const [copied, setCopied] = useState(false);

  // Filter deck based on selected review deck type
  const deck = flashcards.filter((card) => {
    if (filterType === 'ALL') return true;
    return card.type === filterType;
  });

  const currentCard = deck[currentIndex] || null;

  // Keyboard navigation & flip listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === '1' && isFlipped && currentCard) {
        handleRating('Again');
      } else if (e.key === '2' && isFlipped && currentCard) {
        handleRating('Hard');
      } else if (e.key === '3' && isFlipped && currentCard) {
        handleRating('Good');
      } else if (e.key === '4' && isFlipped && currentCard) {
        handleRating('Easy');
      } else if (e.key === 'ArrowRight' && currentIndex < deck.length - 1) {
        setIsFlipped(false);
        setCurrentIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setIsFlipped(false);
        setCurrentIndex((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, deck, currentCard]);

  const handleRating = async (rating) => {
    if (!currentCard) return;
    await onReviseCard(currentCard._id, rating);
    setReviewedCount((prev) => prev + 1);

    // Auto advance to next card
    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFlipped(false);
    }
  };

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'text-[#00B8A3] bg-[#00B8A3]/10 border-[#00B8A3]/30';
      case 'Hard':
        return 'text-[#FF375F] bg-[#FF375F]/10 border-[#FF375F]/30';
      case 'Medium':
      default:
        return 'text-[#FFC01E] bg-[#FFC01E]/10 border-[#FFC01E]/30';
    }
  };

  if (deck.length === 0) {
    return (
      <div className="bg-[#282828] border border-[#3E3E3E] rounded-2xl p-12 text-center max-w-xl mx-auto my-8 shadow-xl">
        <Layers className="w-16 h-16 text-[#FFA116] mx-auto mb-4 opacity-80" />
        <h3 className="text-xl font-bold text-white font-sans mb-2">No Flashcards in Deck</h3>
        <p className="text-sm text-gray-400 mb-6">
          Add some DSA problems or SQL topics to start your spaced repetition review session.
        </p>
      </div>
    );
  }

  const codeOrQuery = currentCard?.type === 'DSA' ? currentCard?.codeSnippet?.code : currentCard?.querySyntax;

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Review Controls & Progress */}
      <div className="bg-[#282828] border border-[#3E3E3E] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        {/* Deck Selector Tabs */}
        <div className="flex items-center space-x-2 bg-[#1A1A1A] p-1 rounded-lg border border-[#3E3E3E]">
          {['ALL', 'DSA', 'SQL'].map((type) => (
            <button
              key={type}
              onClick={() => {
                setFilterType(type);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all ${
                filterType === type
                  ? 'bg-[#282828] text-white shadow border border-[#3E3E3E]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {type} Deck
            </button>
          ))}
        </div>

        {/* Card Counter & Progress */}
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-xs font-mono text-gray-400">
            Card <strong className="text-white font-bold">{currentIndex + 1}</strong> of{' '}
            <strong className="text-white font-bold">{deck.length}</strong>
          </div>
          <div className="w-32 bg-[#1A1A1A] h-2 rounded-full overflow-hidden border border-[#3E3E3E]">
            <div
              className="bg-gradient-to-r from-[#26A641] to-[#39D353] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-[#39D353] font-bold">
            {reviewedCount} Reviewed
          </span>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="perspective-1000 min-h-[360px] sm:min-h-[420px] w-full">
        <div
          className={`relative w-full h-full min-h-[360px] sm:min-h-[420px] transition-transform duration-500 transform-style-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={() => setIsFlipped((prev) => !prev)}
        >
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 bg-[#282828] border-2 border-[#3E3E3E] hover:border-[#FFA116]/50 rounded-2xl p-4 sm:p-8 shadow-2xl flex flex-col justify-between backface-hidden">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span
                    className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border ${
                      currentCard.type === 'DSA'
                        ? 'bg-[#FFA116]/10 text-[#FFA116] border-[#FFA116]/30'
                        : 'bg-[#00B8A3]/10 text-[#00B8A3] border-[#00B8A3]/30'
                    }`}
                  >
                    {currentCard.type === 'DSA' ? <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    {currentCard.type}
                  </span>
                  <span className="bg-[#1A1A1A] text-gray-300 border border-[#3E3E3E] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg text-xs font-mono font-semibold">
                    {currentCard.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-mono font-semibold border ${getDifficultyColor(
                      currentCard.difficulty
                    )}`}
                  >
                    {currentCard.difficulty}
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs font-mono text-gray-500">
                  Mastery Level {currentCard.masteryLevel || 1}
                </span>
              </div>

              {/* Title & Front Question */}
              <div className="my-4 sm:my-8 text-center space-y-3 sm:space-y-4">
                <span className="text-[11px] sm:text-xs uppercase tracking-widest font-mono text-[#FFA116] font-bold">
                  Self-Test Question / Problem
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {currentCard.title}
                </h2>
                {currentCard.conceptNotes && (
                  <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto font-mono">
                    {currentCard.conceptNotes}
                  </p>
                )}
              </div>
            </div>

            {/* Click to Reveal Cue */}
            <div className="pt-4 sm:pt-6 border-t border-[#3E3E3E] flex items-center justify-between text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1 text-[#FFA116] text-[11px] sm:text-xs">
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" /> Click card or press [SPACE] to flip & reveal solution
              </span>
              {currentCard.problemLink && (
                <a
                  href={currentCard.problemLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-gray-400 hover:text-[#FFA116] text-[11px] sm:text-xs shrink-0"
                >
                  <span>LeetCode Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* BACK OF CARD (REVEALED SOLUTION) */}
          <div className="absolute inset-0 bg-[#202020] border-2 border-[#39D353]/50 rounded-2xl p-4 sm:p-8 shadow-2xl flex flex-col justify-between backface-hidden rotate-y-180 overflow-y-auto">
            <div>
              {/* Back Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#3E3E3E]">
                <span className="text-xs uppercase tracking-widest font-mono text-[#39D353] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Solution & Key Insight Revealed
                </span>
                <span className="text-xs font-mono text-gray-400">{currentCard.title}</span>
              </div>

              {/* Key Insight */}
              {currentCard.type === 'DSA' && currentCard.keyInsight && (
                <div className="mb-4 bg-[#1A1A1A] p-4 rounded-xl border border-[#3E3E3E]">
                  <h4 className="text-xs font-mono font-bold text-[#FFA116] uppercase mb-1">
                    💡 Core Trick / Pattern Insight:
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans font-medium">
                    {currentCard.keyInsight}
                  </p>
                </div>
              )}

              {/* Code Snippet / SQL Query */}
              {codeOrQuery && (
                <div className="mb-4 rounded-xl overflow-hidden border border-[#3E3E3E] bg-[#1A1A1A]">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#282828] text-[11px] font-mono text-gray-400 border-b border-[#3E3E3E]">
                    <span className="uppercase text-[#FFA116] font-bold">
                      {currentCard.type === 'DSA' ? currentCard.codeSnippet?.language || 'CPP' : 'SQL Query'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyCode(codeOrQuery);
                      }}
                      className="flex items-center gap-1 text-gray-400 hover:text-white"
                    >
                      {copied ? <Check className="w-3 h-3 text-[#39D353]" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-[#EFF2F6] overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap">
                    <code>{codeOrQuery}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Rating Instruction */}
            <div className="pt-3 border-t border-[#3E3E3E] text-center text-xs font-mono text-gray-400">
              Rate your confidence level below to update Spaced Repetition interval
            </div>
          </div>
        </div>
      </div>

      {/* Spaced Repetition Rating Buttons */}
      <div className="bg-[#282828] border border-[#3E3E3E] rounded-xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setIsFlipped(false);
                setCurrentIndex((prev) => prev - 1);
              }
            }}
            disabled={currentIndex === 0}
            className="p-2 bg-[#1A1A1A] border border-[#3E3E3E] text-gray-300 disabled:opacity-30 rounded-lg hover:bg-[#3E3E3E] transition-colors"
            title="Previous Card [Left Arrow]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (currentIndex < deck.length - 1) {
                setIsFlipped(false);
                setCurrentIndex((prev) => prev + 1);
              }
            }}
            disabled={currentIndex === deck.length - 1}
            className="p-2 bg-[#1A1A1A] border border-[#3E3E3E] text-gray-300 disabled:opacity-30 rounded-lg hover:bg-[#3E3E3E] transition-colors"
            title="Next Card [Right Arrow]"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Spaced Repetition Ratings */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => handleRating('Again')}
            className="px-4 py-2 bg-[#FF375F]/10 hover:bg-[#FF375F]/20 text-[#FF375F] border border-[#FF375F]/30 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1.5 active:scale-95"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>1. Again</span>
          </button>

          <button
            onClick={() => handleRating('Hard')}
            className="px-4 py-2 bg-[#FFC01E]/10 hover:bg-[#FFC01E]/20 text-[#FFC01E] border border-[#FFC01E]/30 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1.5 active:scale-95"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>2. Hard</span>
          </button>

          <button
            onClick={() => handleRating('Good')}
            className="px-4 py-2 bg-[#26A641]/10 hover:bg-[#26A641]/20 text-[#26A641] border border-[#26A641]/30 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1.5 active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>3. Good</span>
          </button>

          <button
            onClick={() => handleRating('Easy')}
            className="px-4 py-2 bg-[#39D353]/20 hover:bg-[#39D353]/30 text-[#39D353] border border-[#39D353]/50 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-[#39D353]" />
            <span>4. Easy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
