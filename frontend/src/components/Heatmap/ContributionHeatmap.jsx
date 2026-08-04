import React, { useState } from 'react';
import { Calendar, Info, CheckCircle2, Flame, Award } from 'lucide-react';

export default function ContributionHeatmap({ heatmapData = [] }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);

  // Group heatmap items into 52 weeks (each week has 7 days Sun-Sat)
  const weeks = [];
  let currentWeek = [];

  heatmapData.forEach((day, index) => {
    currentWeek.push(day);
    if (day.dayOfWeek === 6 || index === heatmapData.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Color mapping based on level 0..4
  const getLevelColor = (level) => {
    switch (level) {
      case 4:
        return 'bg-[#39D353] border-[#39D353] shadow-[0_0_8px_rgba(57,211,83,0.6)]'; // 15+ (vibrant green)
      case 3:
        return 'bg-[#26A641] border-[#26A641]'; // 10-14
      case 2:
        return 'bg-[#006D32] border-[#006D32]'; // 5-9
      case 1:
        return 'bg-[#0E4429] border-[#0E4429]'; // 1-4
      case 0:
      default:
        return 'bg-[#282828] border-[#383838] hover:border-[#555555]'; // 0 items
    }
  };

  // Extract month labels based on the first day of each week
  const monthLabels = [];
  weeks.forEach((week, weekIdx) => {
    if (week.length > 0) {
      const firstDayInWeek = new Date(week[0].date);
      const dayOfMonth = firstDayInWeek.getDate();
      if (dayOfMonth <= 7 || weekIdx === 0) {
        const monthName = firstDayInWeek.toLocaleDateString('en-US', { month: 'short' });
        monthLabels.push({ weekIdx, monthName });
      }
    }
  });

  const totalCardsInYear = heatmapData.reduce((acc, curr) => acc + (curr.count || 0), 0);
  const activeDaysCount = heatmapData.filter((d) => d.count > 0).length;
  const goalHitDaysCount = heatmapData.filter((d) => d.count >= 15).length;

  return (
    <div className="bg-[#282828] rounded-xl border border-[#3E3E3E] p-5 shadow-xl relative overflow-hidden">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#3E3E3E]">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#1A1A1A] rounded-lg border border-[#3E3E3E] text-[#39D353]">
            <Calendar className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white font-sans flex items-center gap-2">
              Revision Heatmap
              <span className="text-xs font-normal text-gray-400 font-mono">
                ({totalCardsInYear} submissions in past year)
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Contribution grid tracking daily DSA problems & SQL queries logged
            </p>
          </div>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-[#3E3E3E] flex items-center space-x-1.5 text-gray-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#39D353]" />
            <span><strong className="text-white">{activeDaysCount}</strong> Active Days</span>
          </div>
          <div className="bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-[#3E3E3E] flex items-center space-x-1.5 text-gray-300">
            <Award className="w-3.5 h-3.5 text-[#FFA116]" />
            <span><strong className="text-white">{goalHitDaysCount}</strong> Goal Hits (15+)</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid & Tooltip Wrapper */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="inline-block min-w-[750px] w-full">
          {/* Month Labels Header */}
          <div className="flex text-[10px] font-mono text-gray-400 mb-2 pl-8 relative h-4">
            {monthLabels.map((m, idx) => (
              <span
                key={idx}
                className="absolute transform -translate-x-1/2 font-semibold text-gray-300"
                style={{ left: `${(m.weekIdx / (weeks.length || 1)) * 100 + 4}%` }}
              >
                {m.monthName}
              </span>
            ))}
          </div>

          {/* Grid Layout: Days of week (Mon, Wed, Fri) + 52 Weeks Grid */}
          <div className="flex items-start space-x-2">
            {/* Weekday Labels (Mon, Wed, Fri) */}
            <div className="flex flex-col justify-between h-[115px] text-[10px] font-mono text-gray-400 py-1 pr-1 font-semibold select-none">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Weeks Columns */}
            <div className="flex space-x-1.5 flex-1 justify-between">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col space-y-1.5">
                  {week.map((day, dIdx) => (
                    <div
                      key={`${wIdx}-${dIdx}`}
                      onMouseEnter={(e) => {
                        setHoveredCell(day);
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipPos({
                          top: rect.top - 42,
                          left: rect.left + rect.width / 2,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredCell(null);
                        setTooltipPos(null);
                      }}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] border transition-all duration-150 cursor-pointer ${getLevelColor(
                        day.level
                      )} hover:scale-125 hover:z-20`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Legend & Hovered Detail Popover */}
      <div className="mt-4 pt-3 border-t border-[#3E3E3E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Hover Info Snippet */}
        <div className="text-gray-300 font-mono flex items-center space-x-2 bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-[#3E3E3E] w-full sm:w-auto justify-center sm:justify-start">
          <Info className="w-3.5 h-3.5 text-[#FFA116]" />
          {hoveredCell ? (
            <span>
              <strong className="text-white">{hoveredCell.count} cards</strong> logged on{' '}
              <span className="text-[#FFA116]">{hoveredCell.displayDate}</span>
              {hoveredCell.count > 0 && (
                <span className="text-gray-400 text-[11px] ml-2">
                  ({hoveredCell.dsaCount} DSA, {hoveredCell.sqlCount} SQL)
                </span>
              )}
              {hoveredCell.count >= 15 && (
                <span className="ml-2 bg-[#39D353]/20 text-[#39D353] border border-[#39D353]/40 px-1.5 py-0.5 rounded text-[10px]">
                  Goal Met! 🔥
                </span>
              )}
            </span>
          ) : (
            <span className="text-gray-400">Hover over grid cells to view date & revision activity breakdown</span>
          )}
        </div>

        {/* GitHub / LeetCode Green Legend */}
        <div className="flex items-center space-x-2 text-gray-400 text-[11px] font-mono select-none">
          <span>Less</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-[2px] bg-[#282828] border border-[#383838]" title="0 submissions" />
            <div className="w-3 h-3 rounded-[2px] bg-[#0E4429] border border-[#0E4429]" title="1-4 submissions" />
            <div className="w-3 h-3 rounded-[2px] bg-[#006D32] border border-[#006D32]" title="5-9 submissions" />
            <div className="w-3 h-3 rounded-[2px] bg-[#26A641] border border-[#26A641]" title="10-14 submissions" />
            <div className="w-3 h-3 rounded-[2px] bg-[#39D353] border border-[#39D353] shadow-[0_0_6px_rgba(57,211,83,0.6)]" title="15+ submissions (Target Hit!)" />
          </div>
          <span>More (15+)</span>
        </div>
      </div>

      {/* Floating LeetCode-style Tooltip */}
      {hoveredCell && tooltipPos && (
        <div
          style={{
            position: 'fixed',
            top: `${tooltipPos.top}px`,
            left: `${tooltipPos.left}px`,
            transform: 'translateX(-50%)',
          }}
          className="z-50 pointer-events-none whitespace-nowrap animate-in fade-in duration-100"
        >
          <div className="bg-[#1E1E1E] text-white text-xs font-sans px-3 py-1.5 rounded-lg border border-[#3E3E3E] shadow-2xl flex items-center gap-1.5">
            <span className="font-semibold text-gray-100">
              {hoveredCell.count === 0
                ? `No submissions on ${hoveredCell.displayDate}`
                : `${hoveredCell.count} ${
                    hoveredCell.count === 1 ? 'submission' : 'submissions'
                  } on ${hoveredCell.displayDate}`}
            </span>
          </div>
          <div className="w-2 h-2 bg-[#1E1E1E] border-r border-b border-[#3E3E3E] rotate-45 -mt-1 mx-auto"></div>
        </div>
      )}
    </div>
  );
}
