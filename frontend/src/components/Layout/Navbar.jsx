import React from 'react';
import { Flame, Plus, Layers, LayoutDashboard, Brain, Database, Code2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAddModal, stats }) {
  return (
    <nav className="bg-[#282828] border-b border-[#3E3E3E] sticky top-0 z-40 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3">
        {/* Brand Logo & Title & Mobile Action bar */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FFA116] to-[#FF7A00] flex items-center justify-center text-white shadow-lg shadow-[#FFA116]/20">
              <Code2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-sans">
                  Leet<span className="text-[#FFA116]">Revision</span>
                </span>
                <span className="bg-[#3E3E3E] text-[#FFA116] text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-[#FFA116]/30">
                  DSA & SQL
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">Personal Spaced Repetition Tracker</p>
            </div>
          </div>

          {/* Quick Streak Indicator for mobile header */}
          <div className="flex md:hidden items-center space-x-2">
            <div className="flex items-center space-x-1 bg-[#1A1A1A] border border-[#3E3E3E] px-2.5 py-1 rounded-lg text-xs font-mono text-gray-300">
              <Flame className="w-3.5 h-3.5 text-[#FFA116] fill-[#FFA116]" />
              <span className="font-bold text-white">{stats?.currentStreak ?? 0}d</span>
            </div>
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1 bg-gradient-to-r from-[#26A641] to-[#15803D] text-white font-medium px-3 py-1.5 rounded-lg text-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-[#1A1A1A] p-1 rounded-xl border border-[#3E3E3E] w-full md:w-auto justify-between sm:justify-start overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#282828] text-white shadow-sm font-semibold border border-[#3E3E3E]'
                : 'text-gray-400 hover:text-white hover:bg-[#282828]/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFA116]" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('cards')}
            className={`flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'cards'
                ? 'bg-[#282828] text-white shadow-sm font-semibold border border-[#3E3E3E]'
                : 'text-gray-400 hover:text-white hover:bg-[#282828]/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#26A641]" />
            <span>Decks</span>
          </button>

          <button
            onClick={() => setActiveTab('revision')}
            className={`flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'revision'
                ? 'bg-[#282828] text-[#39D353] shadow-sm font-semibold border border-[#39D353]/30'
                : 'text-gray-400 hover:text-white hover:bg-[#282828]/50'
            }`}
          >
            <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#39D353] animate-pulse" />
            <span>Reviewer</span>
          </button>
        </div>

        {/* Desktop Actions & Streak Badge */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-[#1A1A1A] border border-[#3E3E3E] px-3 py-1.5 rounded-lg text-xs font-mono text-gray-300">
            <Flame className="w-4 h-4 text-[#FFA116] fill-[#FFA116]" />
            <span className="font-bold text-white">{stats?.currentStreak ?? 0}</span>
            <span className="text-gray-500 text-[10px]">DAYS STREAK</span>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#26A641] to-[#15803D] hover:from-[#39D353] hover:to-[#26A641] text-white font-medium px-4 py-2 rounded-lg text-xs transition-all shadow-md hover:shadow-lg hover:shadow-[#39D353]/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Card</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
