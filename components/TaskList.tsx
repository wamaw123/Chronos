



import React from 'react';
import { Task, ActiveTimer, TimeEntry, Theme, Project, AbacusCode, TaskListProps } from '../types'; // ViewMode removed from import
import TaskItem from './TaskItem';
import { getLocalISODateString } from '../utils/dateUtils';

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, projects, abacusCodes, currentSelectedDate, activeTimer, timeEntries, 
  onStartTimer, onStopTimer, onEditTask, onDeleteTask,
  onCopyTask, onMoveTask, onToggleComplete, onToggleImportant,
  onOpenManualTimeModal, onUpdateTaskInline, onReorderTask, onSaveAsFavorite,
  onAddSubTask, onToggleSubTaskComplete, onDeleteSubTask, 
  onStartSubTaskTimer, onStopSubTaskTimer, // Added sub-task timer handlers
  currentTheme, deletingTaskIds 
}) => {
  const selectedLocalDateString = getLocalISODateString(currentSelectedDate);
  
  const tasksForSelectedDay = tasks
    .filter(task => task.date === selectedLocalDateString)
    .sort((a, b) => a.order - b.order);

  const handleDragOverList = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
  };

  const handleDropOnList = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      const draggedTaskId = e.dataTransfer.getData('text/plain');
      if (draggedTaskId) {
        onReorderTask(draggedTaskId, null, selectedLocalDateString); 
      }
    }
  };
  
  if (tasksForSelectedDay.length === 0) {
     return <p className="text-center text-[var(--text-secondary)] py-8">No tasks for this day. Add a task or navigate to another day.</p>;
  }


  return (
    <div 
      className="space-y-3"
      onDragOver={handleDragOverList}
      onDrop={handleDropOnList}
    >
      {tasksForSelectedDay.map(task => {
        const project = projects.find(p => p.id === task.projectId);
        const abacusCode = task.abacusCodeId ? abacusCodes.find(ac => ac.id === task.abacusCodeId) : undefined;
        const isDeleting = deletingTaskIds.includes(task.id);
        
        return (
          <TaskItem
            key={task.id} 
            task={task}
            project={project} 
            abacusCode={abacusCode}
            activeTimer={activeTimer}
            timeEntries={timeEntries}
            onStartTimer={onStartTimer}
            onStopTimer={onStopTimer}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onCopyTask={onCopyTask}
            onMoveTask={onMoveTask}
            onToggleComplete={onToggleComplete}
            onToggleImportant={onToggleImportant}
            onOpenManualTimeModal={onOpenManualTimeModal}
            onUpdateTaskInline={onUpdateTaskInline}
            onReorderTask={(draggedTaskId, targetTaskId) => onReorderTask(draggedTaskId, targetTaskId, selectedLocalDateString)}
            onSaveAsFavorite={onSaveAsFavorite}
            onAddSubTask={onAddSubTask}
            onToggleSubTaskComplete={onToggleSubTaskComplete}
            onDeleteSubTask={onDeleteSubTask}
            onStartSubTaskTimer={onStartSubTaskTimer} // Pass down
            onStopSubTaskTimer={onStopSubTaskTimer}   // Pass down
            currentTheme={currentTheme}
            isDeleting={isDeleting} 
          />
        );
      })}
    </div>
  );
};

export default TaskList;