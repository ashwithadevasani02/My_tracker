import React, { useState, useEffect } from 'react';
import { X, Code2, Database, Sparkles, Check, Link, Tag, FileText } from 'lucide-react';

const DSA_PATTERNS = [
  'Dynamic Programming',
  'Graphs',
  'Trees & Binary Search Trees',
  'Sliding Window',
  'Two Pointers',
  'Arrays & Hashing',
  'Backtracking',
  'Heaps & Priority Queues',
  'Tries',
  'System Design & OOP',
];

const SQL_TOPICS = [
  'Window Functions',
  'CTEs & Subqueries',
  'Joins & Aggregations',
  'Indexing & Optimization',
  'GROUP BY & HAVING',
  'Pivot & Conditional Logic',
  'Schema Design & DDL',
];

export default function FlashcardModal({ isOpen, onClose, onSave, cardToEdit = null }) {
  const [type, setType] = useState('DSA');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(DSA_PATTERNS[0]);
  const [difficulty, setDifficulty] = useState('Medium');
  const [keyInsight, setKeyInsight] = useState('');
  const [problemLink, setProblemLink] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('cpp');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [conceptNotes, setConceptNotes] = useState('');
  const [topicName, setTopicName] = useState('');
  const [querySyntax, setQuerySyntax] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (cardToEdit) {
      setType(cardToEdit.type || 'DSA');
      setTitle(cardToEdit.title || '');
      setCategory(cardToEdit.category || (cardToEdit.type === 'DSA' ? DSA_PATTERNS[0] : SQL_TOPICS[0]));
      setDifficulty(cardToEdit.difficulty || 'Medium');
      setKeyInsight(cardToEdit.keyInsight || '');
      setProblemLink(cardToEdit.problemLink || '');
      setCodeLanguage(cardToEdit.codeSnippet?.language || 'cpp');
      setCodeSnippet(cardToEdit.codeSnippet?.code || '');
      setConceptNotes(cardToEdit.conceptNotes || '');
      setTopicName(cardToEdit.topicName || '');
      setQuerySyntax(cardToEdit.querySyntax || '');
      setTags(Array.isArray(cardToEdit.tags) ? cardToEdit.tags.join(', ') : cardToEdit.tags || '');
    } else {
      resetForm();
    }
  }, [cardToEdit, isOpen]);

  const resetForm = () => {
    setType('DSA');
    setTitle('');
    setCategory(DSA_PATTERNS[0]);
    setDifficulty('Medium');
    setKeyInsight('');
    setProblemLink('');
    setCodeLanguage('cpp');
    setCodeSnippet('');
    setConceptNotes('');
    setTopicName('');
    setQuerySyntax('');
    setTags('');
    setError('');
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'DSA') {
      setCategory(DSA_PATTERNS[0]);
    } else {
      setCategory(SQL_TOPICS[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const payload = {
      type,
      title: title.trim(),
      category,
      difficulty,
      keyInsight: type === 'DSA' ? keyInsight : '',
      problemLink: type === 'DSA' ? problemLink : '',
      codeSnippet: type === 'DSA' ? { language: codeLanguage, code: codeSnippet } : { language: 'sql', code: '' },
      topicName: type === 'SQL' ? topicName || title : '',
      querySyntax: type === 'SQL' ? querySyntax : '',
      conceptNotes: type === 'DSA' ? conceptNotes : '',
      tags: type === 'DSA' && tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };

    onSave(payload, cardToEdit?._id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#282828] border border-[#3E3E3E] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#3E3E3E] flex items-center justify-between bg-[#202020]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#FFA116]" />
            <h3 className="font-bold text-lg text-white font-sans">
              {cardToEdit ? 'Edit Flashcard' : 'Add New Flashcard'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#3E3E3E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 font-sans text-xs">
          {error && (
            <div className="p-3 bg-[#FF375F]/10 border border-[#FF375F]/30 text-[#FF375F] rounded-lg">
              {error}
            </div>
          )}

          {/* Type Toggle Tabs */}
          <div>
            <label className="block text-gray-400 font-mono font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Flashcard Type
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-[#1A1A1A] rounded-xl border border-[#3E3E3E]">
              <button
                type="button"
                onClick={() => handleTypeChange('DSA')}
                className={`py-2.5 rounded-lg flex items-center justify-center space-x-2 font-mono font-bold transition-all ${
                  type === 'DSA'
                    ? 'bg-[#282828] text-[#FFA116] border border-[#FFA116]/40 shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>DSA Problem</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('SQL')}
                className={`py-2.5 rounded-lg flex items-center justify-center space-x-2 font-mono font-bold transition-all ${
                  type === 'SQL'
                    ? 'bg-[#282828] text-[#00B8A3] border border-[#00B8A3]/40 shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>SQL Query / Topic</span>
              </button>
            </div>
          </div>

          {/* Title & Category & Difficulty Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 font-mono font-semibold mb-1">
                {type === 'DSA' ? 'Problem Title *' : 'Topic / Query Name *'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === 'DSA' ? 'e.g. Coin Change (LeetCode 322)' : 'e.g. Nth Highest Salary using DENSE_RANK()'}
                className="w-full bg-[#1A1A1A] border border-[#3E3E3E] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFA116]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 font-mono font-semibold mb-1">Category / Pattern</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#3E3E3E] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FFA116]"
              >
                {(type === 'DSA' ? DSA_PATTERNS : SQL_TOPICS).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Difficulty & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 font-mono font-semibold mb-1">Difficulty</label>
              <div className="flex space-x-2">
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 py-1.5 rounded-lg border font-mono font-semibold transition-all ${
                      difficulty === diff
                        ? diff === 'Easy'
                          ? 'bg-[#00B8A3]/20 border-[#00B8A3] text-[#00B8A3]'
                          : diff === 'Medium'
                          ? 'bg-[#FFC01E]/20 border-[#FFC01E] text-[#FFC01E]'
                          : 'bg-[#FF375F]/20 border-[#FF375F] text-[#FF375F]'
                        : 'bg-[#1A1A1A] border-[#3E3E3E] text-gray-400 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {type === 'DSA' && (
              <div>
                <label className="block text-gray-400 font-mono font-semibold mb-1">Problem Link (Optional)</label>
                <div className="relative">
                  <Link className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    value={problemLink}
                    onChange={(e) => setProblemLink(e.target.value)}
                    placeholder="https://leetcode.com/problems/..."
                    className="w-full bg-[#1A1A1A] border border-[#3E3E3E] rounded-lg pl-9 pr-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFA116]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Key Insight for DSA */}
          {type === 'DSA' && (
            <div>
              <label className="block text-[#FFA116] font-mono font-semibold mb-1">
                💡 Key Insight / Core Pattern (Flipped Side)
              </label>
              <textarea
                value={keyInsight}
                onChange={(e) => setKeyInsight(e.target.value)}
                rows={2}
                placeholder="State space representation, recurrence relation, or key trick (e.g. dp[i] = min(dp[i], 1 + dp[i-c]))"
                className="w-full bg-[#1A1A1A] border border-[#3E3E3E] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFA116]"
              />
            </div>
          )}

          {/* Code Snippet for DSA / Query Syntax for SQL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-mono font-semibold text-gray-300">
                {type === 'DSA' ? 'Code Snippet Solution' : 'SQL Query / Syntax'}
              </label>
              {type === 'DSA' && (
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="bg-[#1A1A1A] border border-[#3E3E3E] text-[#FFA116] font-mono px-2 py-0.5 rounded text-[11px]"
                >
                  <option value="cpp">C++</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="javascript">JavaScript</option>
                </select>
              )}
            </div>
            <textarea
              value={type === 'DSA' ? codeSnippet : querySyntax}
              onChange={(e) => (type === 'DSA' ? setCodeSnippet(e.target.value) : setQuerySyntax(e.target.value))}
              rows={4}
              placeholder={
                type === 'DSA'
                  ? '// Paste solution code snippet here...'
                  : 'SELECT * FROM Employee WHERE salary > ...'
              }
              className="w-full bg-[#1A1A1A] border border-[#3E3E3E] rounded-lg px-3 py-2 text-white font-mono text-xs placeholder-gray-600 focus:outline-none focus:border-[#FFA116]"
            />
          </div>

          {/* Concept Notes & Tags - Only for DSA */}
          {type === 'DSA' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 font-mono font-semibold mb-1">Concept / Time Complexity Notes</label>
                <input
                  type="text"
                  value={conceptNotes}
                  onChange={(e) => setConceptNotes(e.target.value)}
                  placeholder="Time O(N log N), Space O(N)"
                  className="w-full bg-[#1A1A1A] border border-[#3E3E3E] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFA116]"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-mono font-semibold mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="DP, Binary Search, Hard"
                  className="w-full bg-[#1A1A1A] border border-[#3E3E3E] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFA116]"
                />
              </div>
            </div>
          )}

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-[#3E3E3E] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#1A1A1A] text-gray-400 hover:text-white border border-[#3E3E3E] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#26A641] to-[#39D353] text-white font-bold flex items-center space-x-2 shadow-lg hover:shadow-[#39D353]/20 transition-all active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{cardToEdit ? 'Save Changes' : 'Create Flashcard'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
