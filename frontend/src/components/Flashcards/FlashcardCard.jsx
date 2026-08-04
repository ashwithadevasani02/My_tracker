import React, { useState } from 'react';
import { ExternalLink, Code2, Database, Tag, Calendar, Edit3, Trash2, CheckCircle, Copy, Check } from 'lucide-react';

export default function FlashcardCard({ card, onEdit, onDelete, onRevise }) {
  const [copied, setCopied] = useState(false);

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

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeOrQuery = card.type === 'DSA' ? card.codeSnippet?.code : card.querySyntax;
  const lang = card.type === 'DSA' ? card.codeSnippet?.language || 'cpp' : 'sql';

  return (
    <div className="bg-[#282828] border border-[#3E3E3E] hover:border-[#555555] rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all duration-200 group">
      {/* Top Header & Badges */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            {/* Type Badge */}
            <span
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold flex items-center gap-1 border ${
                card.type === 'DSA'
                  ? 'bg-[#FFA116]/10 text-[#FFA116] border-[#FFA116]/30'
                  : 'bg-[#00B8A3]/10 text-[#00B8A3] border-[#00B8A3]/30'
              }`}
            >
              {card.type === 'DSA' ? <Code2 className="w-3 h-3" /> : <Database className="w-3 h-3" />}
              {card.type}
            </span>

            {/* Category Badge */}
            <span className="bg-[#1A1A1A] text-gray-300 border border-[#3E3E3E] px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold">
              {card.category}
            </span>

            {/* Difficulty Badge */}
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${getDifficultyColor(
                card.difficulty
              )}`}
            >
              {card.difficulty}
            </span>
          </div>

          {/* Action Menu (Edit / Delete) */}
          <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(card)}
              className="p-1.5 hover:bg-[#3E3E3E] text-gray-400 hover:text-white rounded-lg transition-colors"
              title="Edit Card"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(card._id)}
              className="p-1.5 hover:bg-[#FF375F]/20 text-gray-400 hover:text-[#FF375F] rounded-lg transition-colors"
              title="Delete Card"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-bold text-base text-white tracking-tight leading-snug mb-2 font-sans">
          {card.title}
        </h4>

        {/* Key Insight / Concept Note */}
        {(card.keyInsight || card.conceptNotes) && (
          <p className="text-xs text-gray-300 bg-[#1A1A1A] p-3 rounded-lg border border-[#3E3E3E] mb-3 leading-relaxed">
            <strong className="text-[#FFA116] block font-mono text-[11px] mb-0.5">
              {card.type === 'DSA' ? '💡 Key Insight:' : '📝 Concept Notes:'}
            </strong>
            {card.type === 'DSA' ? card.keyInsight : card.conceptNotes}
          </p>
        )}

        {/* Code Snippet / SQL Syntax Container */}
        {codeOrQuery && (
          <div className="mb-3 relative rounded-lg overflow-hidden border border-[#3E3E3E] bg-[#1A1A1A]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#202020] border-b border-[#3E3E3E] text-[10px] font-mono text-gray-400">
              <span className="uppercase text-[#FFA116] font-bold">{lang}</span>
              <button
                onClick={() => copyCode(codeOrQuery)}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-[#39D353]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 text-xs font-mono text-[#EFF2F6] overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap">
              <code>{codeOrQuery}</code>
            </pre>
          </div>
        )}

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {card.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono bg-[#1A1A1A] text-gray-400 border border-[#3E3E3E] px-2 py-0.5 rounded flex items-center gap-1"
              >
                <Tag className="w-2.5 h-2.5 text-gray-500" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info & Links */}
      <div className="pt-3 border-t border-[#3E3E3E] flex items-center justify-between text-xs text-gray-400 font-mono">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1 text-[11px]">
            <Calendar className="w-3 h-3 text-[#26A641]" />
            {card.dateRevised ? new Date(card.dateRevised).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today'}
          </span>
          <span className="text-[10px] text-gray-500">
            Mastery: <span className="text-[#39D353] font-bold">Lvl {card.masteryLevel || 1}</span>
          </span>
        </div>

        {card.problemLink && (
          <a
            href={card.problemLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-[#FFA116] hover:text-[#FF7A00] font-semibold transition-colors"
          >
            <span>LeetCode</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
