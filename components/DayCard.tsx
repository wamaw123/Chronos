import React from 'react';
import { TimeEntry, Task, Project, AbacusCode, Theme, ViewMode, DayCardProps } from '../types';
import { formatDate, formatDuration, getLocalISODateString } from '../utils/dateUtils';

interface TaskSummaryForDayCard {
  taskId: string; // Keep track of the original task ID
  taskName: string;
  duration: number;
  projectName?: string;
  projectColor?: string;
  abacusCodeValue?: string;
  isCompleted: boolean; // To show status in summary
}

const DayCard: React.FC<DayCardProps> = ({ 
  date, 
  timeEntries, 
  tasks, 
  projects, 
  abacusCodes, 
  currentTheme, 
  viewMode, 
  onDayCardClick,
  onTaskItemClick 
}) => {
  const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });
  const formattedDayDate = formatDate(date, { day: 'numeric' });
  const localDateStr = getLocalISODateString(date);

  const tasksForThisDay = tasks.filter(task => task.date === localDateStr);

  const entriesForDay = timeEntries.filter(entry => {
    const taskForEntry = tasksForThisDay.find(t => t.id === entry.taskId);
    if (!taskForEntry) return false;
    // Ensure time entry's start time falls on this specific DayCard's date
    const entryStartDate = new Date(entry.startTime);
    return getLocalISODateString(entryStartDate) === localDateStr;
  });

  const totalDurationForDay = entriesForDay.reduce((sum, entry) => sum + entry.duration, 0);

  const tasksWithTime: TaskSummaryForDayCard[] = React.useMemo(() => {
    const taskTimeMap = new Map<string, { totalDuration: number, task: Task }>();

    tasksForThisDay.forEach(task => {
      taskTimeMap.set(task.id, { totalDuration: 0, task });
    });

    entriesForDay.forEach(entry => {
      const taskDetails = taskTimeMap.get(entry.taskId);
      if (taskDetails) {
        taskDetails.totalDuration += entry.duration;
      }
    });

    const summaries: TaskSummaryForDayCard[] = [];
    taskTimeMap.forEach((details) => {
      if (details.totalDuration > 0) { // Only include tasks with logged time for this summary
        const project = projects.find(p => p.id === details.task.projectId);
        const abacusCode = details.task.abacusCodeId ? abacusCodes.find(ac => ac.id === details.task.abacusCodeId) : undefined;
        summaries.push({
          taskId: details.task.id, // Include taskId
          taskName: details.task.name,
          duration: details.totalDuration,
          projectName: project?.name,
          projectColor: project?.color,
          abacusCodeValue: abacusCode?.code,
          isCompleted: details.task.isCompleted,
        });
      }
    });
    return summaries.sort((a, b) => b.duration - a.duration);
  }, [tasksForThisDay, entriesForDay, projects, abacusCodes]);
  
  const glassEffectClass = currentTheme === 'glass' ? 'glass-effect' : '';

  const handleCardHeaderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent click if it's on a task item itself
    if ((e.target as HTMLElement).closest('.task-summary-item')) {
      return;
    }
    if (onDayCardClick && viewMode === 'weeklyView') { // Only navigate if in weeklyView context
      onDayCardClick(date);
    }
  };

  const dayCardBaseClasses = `day-card-interactive-wrapper p-3 sm:p-4 rounded-lg shadow-lg h-full flex flex-col bg-[var(--bg-card)] border border-[var(--border-color)] ${glassEffectClass}`;
  const dayCardInteractiveClasses = onDayCardClick && viewMode === 'weeklyView' ? 'cursor-pointer transition-colors' : '';

  const taskSummaryBaseClasses = `task-summary-item day-card-task-summary text-xs p-1.5 rounded border relative overflow-hidden`;
  // Changed transition-colors to transition-all for transform and box-shadow animations
  const taskSummaryInteractiveClasses = onTaskItemClick && viewMode === 'weeklyView' ? 'cursor-pointer transition-all duration-150 ease-out' : '';


  return (
    <div
      className={`${dayCardBaseClasses} ${dayCardInteractiveClasses}`}
      style={{ boxShadow: `0 4px 6px -1px var(--shadow-color-soft), 0 2px 4px -1px var(--shadow-color-medium)` }}
    >
      <div 
        className="text-center mb-2 sm:mb-3"
        onClick={handleCardHeaderClick} 
      >
        <p className="text-xs sm:text-sm font-medium text-[var(--text-accent)]">{dayName}</p>
        <p className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">{formattedDayDate}</p>
      </div>
      <div className="flex-grow space-y-1 overflow-y-auto pr-1 themed-scrollbar min-h-[50px] sm:min-h-[60px]">
        {tasksWithTime.length === 0 && tasksForThisDay.length === 0 && (
          <p className="text-xs text-[var(--text-secondary)] text-center pt-2 sm:pt-4">No tasks or time logged.</p>
        )}
        {tasksWithTime.length === 0 && tasksForThisDay.length > 0 && (
          <p className="text-xs text-[var(--text-secondary)] text-center pt-2 sm:pt-4">No time logged for tasks on this day.</p>
        )}
        {
          tasksWithTime.map((item) => (
            <div 
              key={item.taskId}
              className={`${taskSummaryBaseClasses} ${taskSummaryInteractiveClasses} ${item.isCompleted ? 'opacity-70' : ''}`}
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.05)'}}
              onClick={() => onTaskItemClick && viewMode === 'weeklyView' && onTaskItemClick(item.taskId)}
              title={onTaskItemClick && viewMode === 'weeklyView' ? `View details for "${item.taskName}"` : item.taskName}
            >
              {item.projectColor && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: item.projectColor }}
                  title={item.projectName ? `Project: ${item.projectName}` : undefined}
                ></div>
              )}
              <div className={item.projectColor ? "pl-2" : ""}>
                <p className={`font-medium text-[var(--text-main)] truncate ${item.isCompleted ? 'line-through' : ''}`} title={item.taskName}>{item.taskName}</p>
                {item.projectName && <p className={`text-[var(--text-secondary)] opacity-75 truncate text-[0.65rem] ${item.isCompleted ? 'line-through' : ''}`} title={item.projectName}>{item.projectName}</p>}
                {item.abacusCodeValue && <p className={`text-[var(--text-secondary)] opacity-75 truncate text-[0.65rem] ${item.isCompleted ? 'line-through' : ''}`} title={`Abacus: ${item.abacusCodeValue}`}>Abacus: {item.abacusCodeValue}</p>}
                <p className="text-[var(--text-secondary)]">{formatDuration(item.duration)}</p>
              </div>
            </div>
          ))
        }
      </div>
      <div 
        className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[var(--border-color)] text-center"
        onClick={handleCardHeaderClick}
      >
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Total Logged:</p>
        <p className="font-semibold text-[var(--text-accent)] text-sm sm:text-base">{formatDuration(totalDurationForDay)}</p>
      </div>
    </div>
  );
};

export default DayCard;