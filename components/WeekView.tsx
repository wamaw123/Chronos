
import React from 'react';
import { WeekViewProps } from '../types'; // Updated to use WeekViewProps from types.ts
import { getDaysInWeek, getStartOfWeek, formatDate, getLocalISODateString } from '../utils/dateUtils';
import DayCard from './DayCard'; 
import WeeklyDashboard from './WeeklyDashboard';


const WeekView: React.FC<WeekViewProps> = ({ 
  currentDateForWeek, 
  timeEntries, 
  tasks, 
  projects, 
  abacusCodes, 
  currentTheme, 
  viewMode,
  onDaySelect,          // New prop
  onTaskSelectForDetail // New prop
}) => {
  const weekStartsOnMonday = 1; 
  const actualWeekStart = getStartOfWeek(currentDateForWeek, weekStartsOnMonday);
  const daysInWeek = getDaysInWeek(actualWeekStart);

  const weekEnd = new Date(actualWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 7); 

  // Filter time entries for the entire week once
  const timeEntriesForWeek = timeEntries.filter(entry => {
    const entryDate = new Date(entry.startTime);
    return entryDate >= actualWeekStart && entryDate < weekEnd;
  });
  
  const totalWeekDuration = timeEntriesForWeek.reduce((sum, entry) => sum + entry.duration, 0);

  // Filter tasks for the entire week once
  const tasksForWeek = React.useMemo(() => {
    const weekDayStrings = daysInWeek.map(day => getLocalISODateString(day)); 
    return tasks.filter(task => weekDayStrings.includes(task.date));
  }, [tasks, daysInWeek]);

  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-accent)] mb-1 sm:mb-2 text-center">
          Weekly Timesheet for week of {formatDate(actualWeekStart, {month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
      </div>

      {/* Grid of DayCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {daysInWeek.map(day => (
          <DayCard
            key={getLocalISODateString(day)} // Use local ISO string for key consistency
            date={day}
            timeEntries={timeEntries} // Pass all, DayCard filters for its specific day.
            tasks={tasks}           // Pass all, DayCard filters.
            projects={projects}
            abacusCodes={abacusCodes}
            currentTheme={currentTheme}
            viewMode={viewMode} 
            onDayCardClick={onDaySelect} // Pass down the handler
            onTaskItemClick={onTaskSelectForDetail} // Pass down the handler
          />
        ))}
      </div>
      
      {/* Weekly Infographic Dashboard */}
      <WeeklyDashboard
        tasksForWeek={tasksForWeek} 
        timeEntriesForWeek={timeEntriesForWeek} 
        projects={projects}
        currentTheme={currentTheme}
        daysInWeek={daysInWeek}
        totalWeekDuration={totalWeekDuration}
      />
    </>
  );
};

export default WeekView;
