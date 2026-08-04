import React from 'react';
import { Flame, Zap, Library, Target, Database, Code, CheckCircle, ArrowUpRight } from 'lucide-react';

export default function MetricsHeader({ stats, onOpenAddModal, setActiveTab }) {
  const {
    currentStreak = 0,
    maxStreak = 0,
    totalCards = 0,
    dsaCardsCount = 0,
    sqlCardsCount = 0,
    todayProgress = { dsaCount: 0, dsaTarget: 15, dsaPercentage: 0, sqlCount: 0, sqlTarget: 1, sqlPercentage: 0 },
  } = stats || {};

  return (
    <div className="space-y-4">
      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Streak */}
        <div className="bg-[#282828] border border-[#3E3E3E] rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-[#FFA116]/50 transition-all duration-300">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame className="w-32 h-32 text-[#FFA116]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider">
              Current Streak
            </span>
            <div className="p-2 bg-[#FFA116]/10 rounded-lg text-[#FFA116] border border-[#FFA116]/20">
              <Flame className="w-5 h-5 fill-[#FFA116] animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {currentStreak}
            </span>
            <span className="text-sm font-medium text-[#FFA116]">Days</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
            <span>Keep your daily revision streak alive</span>
          </p>
        </div>

        {/* Card 2: Max Streak */}
        <div className="bg-[#282828] border border-[#3E3E3E] rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-[#FFB800]/50 transition-all duration-300">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-32 h-32 text-[#FFB800]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider">
              Max Streak Record
            </span>
            <div className="p-2 bg-[#FFB800]/10 rounded-lg text-[#FFB800] border border-[#FFB800]/20">
              <Zap className="w-5 h-5 fill-[#FFB800]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {maxStreak}
            </span>
            <span className="text-sm font-medium text-[#FFB800]">Days</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Personal all-time continuous record
          </p>
        </div>

        {/* Card 3: Total Cards Revised */}
        <div className="bg-[#282828] border border-[#3E3E3E] rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-[#26A641]/50 transition-all duration-300">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Library className="w-32 h-32 text-[#26A641]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider">
              Total Cards Logged
            </span>
            <div className="p-2 bg-[#26A641]/10 rounded-lg text-[#26A641] border border-[#26A641]/20">
              <Library className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {totalCards}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              ({dsaCardsCount} DSA / {sqlCardsCount} SQL)
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-gray-400">Mastered concepts library</span>
            <button
              onClick={() => setActiveTab('cards')}
              className="text-[#39D353] hover:underline flex items-center font-medium"
            >
              View Decks <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Card 4: Daily Goal Status */}
        <div className="bg-[#282828] border border-[#3E3E3E] rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-[#39D353]/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider">
              Today's Goal Progress
            </span>
            <div className="p-2 bg-[#39D353]/10 rounded-lg text-[#39D353] border border-[#39D353]/20">
              <Target className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 space-y-2.5">
            {/* DSA Progress */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-gray-300 flex items-center gap-1">
                  <Code className="w-3 h-3 text-[#FFA116]" /> DSA Goal (15/day)
                </span>
                <span className="text-[#39D353] font-bold">
                  {todayProgress.dsaCount} / {todayProgress.dsaTarget}
                </span>
              </div>
              <div className="w-full bg-[#1A1A1A] h-2 rounded-full overflow-hidden border border-[#3E3E3E]">
                <div
                  className="bg-gradient-to-r from-[#26A641] to-[#39D353] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, todayProgress.dsaPercentage)}%` }}
                />
              </div>
            </div>

            {/* SQL Progress */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-gray-300 flex items-center gap-1">
                  <Database className="w-3 h-3 text-[#00B8A3]" /> SQL Goal (1 topic/day)
                </span>
                <span className="text-[#00B8A3] font-bold">
                  {todayProgress.sqlCount} / {todayProgress.sqlTarget}
                </span>
              </div>
              <div className="w-full bg-[#1A1A1A] h-2 rounded-full overflow-hidden border border-[#3E3E3E]">
                <div
                  className="bg-gradient-to-r from-[#00B8A3] to-[#39D353] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, todayProgress.sqlPercentage)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
