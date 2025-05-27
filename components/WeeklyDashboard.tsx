

import React from 'react';
import { WeeklyDashboardProps, Project, Task, TimeEntry } from '../types';
import { formatDuration, getLocalISODateString } from '../utils/dateUtils';

interface ProjectTimeSummary {
  projectId: string;
  name: string;
  color: string;
  totalDuration: number;
}

interface DailyActivity {
  date: Date;
  totalDuration: number;
  dayInitial: string;
}

const WeeklyDashboard: React.FC<WeeklyDashboardProps> = ({
  tasksForWeek,
  timeEntriesForWeek, // Note: This prop might become less central if sub-task time is not in entries
  projects,
  currentTheme,
  daysInWeek,
  totalWeekDuration, // This is now calculated in App.tsx considering sub-tasks
}) => {
  const glassEffectClass = currentTheme === 'glass' ? 'glass-effect' : '';

  // Calculate total time per project for the week
  const projectTimeSummaries = React.useMemo(() => {
    const summaryMap = new Map<string, ProjectTimeSummary>();
    projects.forEach(p => {
      summaryMap.set(p.id, { projectId: p.id, name: p.name, color: p.color, totalDuration: 0 });
    });
    
    tasksForWeek.forEach(task => {
        if (task.projectId) {
            const projectSummary = summaryMap.get(task.projectId);
            if (projectSummary) {
                // Add direct time entries for the task
                const directTime = timeEntriesForWeek
                    .filter(entry => entry.taskId === task.id)
                    .reduce((sum, entry) => sum + entry.duration, 0);
                projectSummary.totalDuration += directTime;

                // Add logged time from sub-tasks
                const subTaskTime = (task.subTasks || []).reduce((sum, st) => sum + (st.timeLogged || 0), 0);
                projectSummary.totalDuration += subTaskTime;
            }
        }
    });
    return Array.from(summaryMap.values()).filter(s => s.totalDuration > 0).sort((a, b) => b.totalDuration - a.totalDuration);
  }, [tasksForWeek, timeEntriesForWeek, projects]);


  // Calculate task status summary for the week
  const taskStatusSummary = React.useMemo(() => {
    let completed = 0;
    let active = 0;
    tasksForWeek.forEach(task => {
      task.isCompleted ? completed++ : active++;
    });
    return { completed, active, total: tasksForWeek.length };
  }, [tasksForWeek]);

  // Calculate daily activity for the bar chart
  const dailyActivities = React.useMemo(() => {
    return daysInWeek.map(day => {
      const localDateStr = getLocalISODateString(day);
      let dailyDuration = 0;
      tasksForWeek.forEach(task => {
        if (task.date === localDateStr) {
            // Direct task entries for this day
            timeEntriesForWeek
                .filter(entry => entry.taskId === task.id && getLocalISODateString(new Date(entry.startTime)) === localDateStr)
                .forEach(entry => dailyDuration += entry.duration);
            
            // Sub-task time (assuming subTask.timeLogged is for the parent task's date)
            // This simplification assumes subtask time is logged against the parent task's date
            (task.subTasks || []).forEach(st => dailyDuration += (st.timeLogged || 0));
        }
      });

      return {
        date: day,
        totalDuration: dailyDuration,
        dayInitial: day.toLocaleDateString(undefined, { weekday: 'narrow' }),
      };
    });
  }, [daysInWeek, tasksForWeek, timeEntriesForWeek]);

  const maxDailyDuration = Math.max(...dailyActivities.map(da => da.totalDuration), 1); 

  if (tasksForWeek.length === 0 && timeEntriesForWeek.length === 0 && totalWeekDuration === 0) {
    return (
      <div className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg shadow-xl bg-[var(--bg-card)] border border-[var(--border-color)] ${glassEffectClass}`}>
        <h3 className="text-xl sm:text-2xl font-semibold text-[var(--text-accent)] mb-4 text-center">Weekly Dashboard</h3>
        <p className="text-center text-[var(--text-secondary)] py-8">No data available for this week.</p>
      </div>
    );
  }
  
  const chartBarHeight = 120; 

  return (
    <div 
      className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg shadow-xl 
                 bg-[var(--bg-card)] border border-[var(--border-color)] ${glassEffectClass}`}
      style={{ boxShadow: `0 6px 10px -2px var(--shadow-color-soft), 0 4px 6px -2px var(--shadow-color-medium)`}}
    >
      {/* Overall Weekly Summary */}
      <div className="mb-6 sm:mb-8 text-center">
        <p className="text-base sm:text-lg text-[var(--text-secondary)]">Total Hours Logged This Week</p>
        <p className="text-3xl sm:text-4xl font-bold text-[var(--text-accent)]">
          {formatDuration(totalWeekDuration)}
        </p>
      </div>

      {/* Daily Activity Chart */}
      <div className={`p-3 sm:p-4 rounded-md border ${currentTheme === 'glass' ? 'bg-[var(--bg-modal)]' : 'bg-[var(--bg-input)]'} border-[var(--border-color)] mb-6`}>
        <h4 className="text-md sm:text-lg font-medium text-[var(--text-main)] mb-4 text-center">Daily Activity</h4>
        {dailyActivities.some(da => da.totalDuration > 0) ? (
            <div className="flex justify-around items-end h-[180px] pt-2 px-1" role="figure" aria-label="Daily logged hours chart">
            {dailyActivities.map((activity, index) => (
                <div key={index} className="flex flex-col items-center w-1/7 text-center group" title={`${activity.date.toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})}: ${formatDuration(activity.totalDuration)}`}>
                <div 
                    className="w-6 sm:w-8 bg-[var(--accent-primary)] rounded-t-sm hover:opacity-80 transition-opacity"
                    style={{ 
                        height: `${activity.totalDuration > 0 ? (activity.totalDuration / maxDailyDuration) * chartBarHeight : 2}px`,
                        minHeight: '2px' 
                    }}
                    aria-valuenow={activity.totalDuration}
                    aria-valuemin={0}
                    aria-valuemax={maxDailyDuration}
                    role="progressbar"
                >
                </div>
                 <div className="text-xs text-[var(--text-secondary)] mt-1 truncate group-hover:text-[var(--text-main)]">
                    {formatDuration(activity.totalDuration)}
                </div>
                <div className="text-xs font-medium text-[var(--text-accent)] mt-0.5">{activity.dayInitial}</div>
                </div>
            ))}
            </div>
        ) : (
            <p className="text-sm text-[var(--text-secondary)] italic text-center py-4">No activity logged this week.</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Project Time Distribution */}
        <div className={`p-3 sm:p-4 rounded-md border ${currentTheme === 'glass' ? 'bg-[var(--bg-modal)]' : 'bg-[var(--bg-input)]'} border-[var(--border-color)]`}>
          <h4 className="text-md sm:text-lg font-medium text-[var(--text-main)] mb-3">Project Time Distribution</h4>
          {projectTimeSummaries.length > 0 ? (
            <ul className="space-y-3 max-h-60 overflow-y-auto themed-scrollbar pr-2">
              {projectTimeSummaries.map(summary => (
                <li key={summary.projectId} className="text-sm">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center min-w-0">
                      <span 
                        className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                        style={{ backgroundColor: summary.color }}
                        title={`Project color: ${summary.color}`}
                      ></span>
                      <span className="text-[var(--text-secondary)] flex-grow truncate" title={summary.name}>{summary.name}</span>
                    </div>
                    <span className="ml-2 font-semibold text-[var(--text-main)] whitespace-nowrap">{formatDuration(summary.totalDuration)}</span>
                  </div>
                  <div className="h-2.5 w-full bg-[var(--bg-input-disabled)] rounded">
                    <div 
                        className="h-full rounded" 
                        style={{ 
                            width: `${totalWeekDuration > 0 ? (summary.totalDuration / totalWeekDuration) * 100 : 0}%`, 
                            backgroundColor: summary.color,
                            minWidth: '2px' 
                        }}
                        title={`${totalWeekDuration > 0 ? ((summary.totalDuration / totalWeekDuration) * 100).toFixed(1) + '% of weekly total' : '0%'}`}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-secondary)] italic">No time logged against specific projects this week.</p>
          )}
        </div>

        {/* Task Status Overview */}
        <div className={`p-3 sm:p-4 rounded-md border ${currentTheme === 'glass' ? 'bg-[var(--bg-modal)]' : 'bg-[var(--bg-input)]'} border-[var(--border-color)]`}>
          <h4 className="text-md sm:text-lg font-medium text-[var(--text-main)] mb-3">Task Status Overview</h4>
          {taskStatusSummary.total > 0 ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Completed Tasks:</span>
                <span className="font-semibold text-[var(--text-main)]">{taskStatusSummary.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Active Tasks:</span>
                <span className="font-semibold text-[var(--text-main)]">{taskStatusSummary.active}</span>
              </div>
              
              <div className="pt-2">
                <div className="text-xs text-[var(--text-secondary)] mb-1">Ratio (Completed vs Active)</div>
                <div className="h-4 w-full flex rounded bg-[var(--bg-input-disabled)]" title={`Completed: ${taskStatusSummary.completed}, Active: ${taskStatusSummary.active}`}>
                  <div 
                    className="h-full rounded-l" 
                    style={{ 
                        width: `${taskStatusSummary.total > 0 ? (taskStatusSummary.completed / taskStatusSummary.total) * 100 : 0}%`, 
                        backgroundColor: 'var(--button-start-bg)' 
                    }}
                  ></div>
                  <div 
                    className="h-full rounded-r" 
                    style={{ 
                        width: `${taskStatusSummary.total > 0 ? (taskStatusSummary.active / taskStatusSummary.total) * 100 : 0}%`, 
                        backgroundColor: 'var(--accent-secondary)'
                    }}
                  ></div>
                </div>
              </div>

              <p className="text-[var(--text-secondary)] pt-2 border-t border-[var(--border-color)] mt-2">
                Total Tasks This Week: <span className="font-semibold text-[var(--text-main)]">{taskStatusSummary.total}</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-secondary)] italic">No tasks scheduled for this week.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyDashboard;