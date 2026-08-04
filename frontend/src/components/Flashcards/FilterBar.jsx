import React from 'react';
import { Search, Filter, RotateCcw, Code2, Database } from 'lucide-react';

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  categories = { dsa: [], sql: [] },
  onReset,
}) {
  const categoryOptions =
    selectedType === 'DSA'
      ? categories.dsa
      : selectedType === 'SQL'
      ? categories.sql
      : [...(categories.dsa || []), ...(categories.sql || [])];

  return (
    <div className="bg-[#282828] border border-[#3E3E3E] rounded-xl p-3.5 sm:p-4 shadow-lg mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 font-sans text-xs">
      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search problems, patterns, queries..."
          className="w-full bg-[#1A1A1A] border border-[#3E3E3E] rounded-lg pl-9 pr-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFA116] text-xs sm:text-xs"
        />
      </div>

      {/* Filter Selects & Type Switcher */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-between sm:justify-start">
        {/* Type Toggle Buttons */}
        <div className="flex bg-[#1A1A1A] p-1 rounded-lg border border-[#3E3E3E] w-full sm:w-auto justify-stretch">
          {['ALL', 'DSA', 'SQL'].map((t) => (
            <button
              key={t}
              onClick={() => {
                setSelectedType(t);
                setSelectedCategory('ALL');
              }}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded font-mono font-bold text-[11px] transition-all flex items-center justify-center gap-1 ${
                selectedType === t
                  ? 'bg-[#282828] text-white shadow border border-[#3E3E3E]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t === 'DSA' && <Code2 className="w-3 h-3 text-[#FFA116]" />}
              {t === 'SQL' && <Database className="w-3 h-3 text-[#00B8A3]" />}
              {t}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center space-x-1 flex-1 sm:flex-initial min-w-[130px]">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#3E3E3E] text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#FFA116] font-mono text-[11px] truncate"
          >
            <option value="ALL">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Dropdown */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="bg-[#1A1A1A] border border-[#3E3E3E] text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#FFA116] font-mono text-[11px] flex-1 sm:flex-initial"
        >
          <option value="ALL">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Reset Filters */}
        <button
          onClick={onReset}
          className="px-3 py-1.5 bg-[#1A1A1A] border border-[#3E3E3E] text-gray-400 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-[11px] font-mono"
          title="Reset Filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
