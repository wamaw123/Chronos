

import React from 'react';
import { DateNavigationToolbarProps, ViewMode } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, CalendarIcon as TaskViewIcon, PlusIcon } from '../constants';
import { formatDate, getLocalISODateString, getStartOfWeek, addDays } from '../utils/dateUtils';

const ViewModeButton: React.FC<{
  targetMode: ViewMode;
  currentMode: ViewMode;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ targetMode, currentMode, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-md transition-colors border border-[var(--border-color)] flex items-center space-x-2
                ${currentMode === targetMode 
                  ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)] shadow-inner' 
                  : 'bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                }`}
    aria-pressed={currentMode === targetMode}
    title={`Switch to ${label} view`}
  >
    {icon}
    <span className="hidden sm:inline text-xs">{label}</span>
  </button>
);


const DateNavigationToolbar: React.FC<DateNavigationToolbarProps> = ({
  currentSelectedDate,
  onPreviousDay,
  onNextDay,
  onGoToToday,
  viewMode,
  setViewMode,
  currentTheme,
  onAddTask, 
  isProjectsManagerOpen, 
  isAbacusCodesManagerOpen,
  isFavoritesManagerOpen, // Added
}) => {
  const isWeeklyView = viewMode === 'weeklyView';
  const glassEffectClass = currentTheme === 'glass' ? 'glass-effect' : '';

  let dateButtonText: string;
  let isCurrentPeriodToday: boolean;
  let mobileFormattedDate: string;

  if (isWeeklyView) {
    const weekStart = getStartOfWeek(currentSelectedDate, 1);
    const weekEnd = addDays(weekStart, 6);
    dateButtonText = `${formatDate(weekStart, { month: 'short', day: 'numeric' })} - ${formatDate(weekEnd, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    mobileFormattedDate = `Week: ${formatDate(weekStart, {month: 'short', day: 'numeric'})} - ${formatDate(weekEnd, {month: 'short', day: 'numeric'})}, ${weekStart.getFullYear()}`;
    const todayWeekStart = getStartOfWeek(new Date(), 1);
    isCurrentPeriodToday = getLocalISODateString(weekStart) === getLocalISODateString(todayWeekStart);
  } else {
    dateButtonText = formatDate(currentSelectedDate, { weekday: 'short', month: 'short', day: 'numeric' });
    mobileFormattedDate = formatDate(currentSelectedDate, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    isCurrentPeriodToday = getLocalISODateString(currentSelectedDate) === getLocalISODateString(new Date());
  }
  
  const prevButtonLabel = isWeeklyView ? "Previous Week" : "Previous Day";
  const nextButtonLabel = isWeeklyView ? "Next Week" : "Next Day";
  const goToTodayButtonTitle = isWeeklyView 
    ? (isCurrentPeriodToday ? "Current Week" : "Go to This Week")
    : (isCurrentPeriodToday ? "Today" : "Go to Today");
  
  const anyManagerOpen = isProjectsManagerOpen || isAbacusCodesManagerOpen || isFavoritesManagerOpen;

  return (
    <div 
      className={`p-2 sm:p-3 bg-[var(--bg-card)] border-b border-[var(--border-color)] shadow-md ${glassEffectClass}
                 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4`}
    >
      {/* Date Navigation */}
      <div className="flex items-center space-x-1">
        <button
          onClick={onPreviousDay}
          className="p-2 text-[var(--text-main)] bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] rounded-md transition-colors border border-[var(--border-color)]"
          title={prevButtonLabel} aria-label={prevButtonLabel}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onGoToToday}
          className={`px-2 py-2 text-xs sm:text-sm text-[var(--text-main)] bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] rounded-md transition-colors border border-[var(--border-color)] whitespace-nowrap
                      ${isCurrentPeriodToday ? 'ring-2 ring-[var(--accent-secondary)]' : ''}`}
          title={goToTodayButtonTitle}
        >
          {dateButtonText}
        </button>
        <button
          onClick={onNextDay}
          className="p-2 text-[var(--text-main)] bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] rounded-md transition-colors border border-[var(--border-color)]"
          title={nextButtonLabel} aria-label={nextButtonLabel}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* View Mode Toggles */}
      <div className="flex items-center space-x-1 p-0.5 rounded-md bg-transparent sm:bg-[var(--bg-card)] border-none sm:border sm:border-[var(--border-color)] shadow-none sm:shadow-sm">
        <ViewModeButton 
          targetMode="dailyTasks" 
          currentMode={viewMode} 
          onClick={() => setViewMode('dailyTasks')} 
          icon={<TaskViewIcon className="w-4 h-4"/>}
          label="Daily"
        />
        <ViewModeButton 
          targetMode="weeklyView" 
          currentMode={viewMode} 
          onClick={() => setViewMode('weeklyView')} 
          icon={<EyeIcon className="w-4 h-4"/>}
          label="Weekly"
        />
      </div>
      
      {/* Add Task Button */}
      <button
        onClick={onAddTask}
        className="flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-[var(--text-on-accent)] bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] rounded-md transition-colors border border-[var(--accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={anyManagerOpen} 
      >
        <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
        Add Task
      </button>
      
      <div className="text-center text-xs text-[var(--text-secondary)] sm:hidden pt-1">
        {mobileFormattedDate}
      </div>
    </div>
  );
};

export default DateNavigationToolbar;