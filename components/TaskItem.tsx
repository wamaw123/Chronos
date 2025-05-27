

import React, { useState, useEffect, useRef } from 'react';
import { Task, ActiveTimer, TimeEntry, Theme, Project, AbacusCode, TaskItemProps, SubTask } from '../types';
import { PlayIcon, StopIcon, EditIcon, TrashIcon, CopyIcon, MoveIcon, CheckboxIcon, CheckboxCheckedIcon, StarIcon, StarFilledIcon, ClockIcon, EllipsisVerticalIcon, BookmarkIcon, PlusIcon, ChevronDownIcon, ChevronUpIcon } from '../constants';
import { formatDuration } from '../utils/dateUtils';
import { generateId } from '../utils/idUtils';

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, project, abacusCode, activeTimer, 
  onStartTimer, onStopTimer, onEditTask, onDeleteTask, 
  onCopyTask, onMoveTask, onToggleComplete, onToggleImportant,
  onOpenManualTimeModal, onUpdateTaskInline, onReorderTask,
  onSaveAsFavorite,
  onAddSubTask, onToggleSubTaskComplete, onDeleteSubTask, 
  onStartSubTaskTimer, onStopSubTaskTimer, // Sub-task timer handlers
  timeEntries, currentTheme, isDeleting
}) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  // This checks if the timer active is for THIS task (either main or one of its subtasks)
  const isTimerActiveForThisTaskContext = activeTimer?.taskId === task.id;

  const [editingField, setEditingField] = useState<'name' | 'description' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const draggableItemRef = useRef<HTMLDivElement>(null);

  const [isDraggingState, setIsDraggingState] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isSubtasksOpen, setIsSubtasksOpen] = useState(false);
  const [newSubTaskName, setNewSubTaskName] = useState('');
  const subTaskInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    let intervalId: number | undefined; 
    if (isTimerActiveForThisTaskContext && activeTimer?.startTime) {
      const updateElapsedTime = () => {
        setElapsedTime(Date.now() - activeTimer.startTime);
      };
      updateElapsedTime(); 
      intervalId = window.setInterval(updateElapsedTime, 1000); 
    } else {
      setElapsedTime(0); 
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTimerActiveForThisTaskContext, activeTimer?.startTime]);

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
      if (editingField === 'name' && inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [editingField]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          menuTriggerRef.current && !menuTriggerRef.current.contains(event.target as Node)) {
        setIsActionsMenuOpen(false);
      }
    };
    if (isActionsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActionsMenuOpen]);

  const directTimeForTask = timeEntries
    .filter(entry => entry.taskId === task.id)
    .reduce((sum, entry) => sum + entry.duration, 0);

  const subTasksLoggedTime = (task.subTasks || [])
    .reduce((sum, subTask) => sum + (subTask.timeLogged || 0), 0);
  
  const totalTaskLoggedTime = directTimeForTask + subTasksLoggedTime;
  
  let displayTotalTime = formatDuration(totalTaskLoggedTime);
  let currentTimerDisplay = '';

  if (isTimerActiveForThisTaskContext && elapsedTime > 0) {
    if (activeTimer?.subTaskId) {
        const activeSubTask = task.subTasks?.find(st => st.id === activeTimer.subTaskId);
        currentTimerDisplay = ` (Sub-task "${activeSubTask?.name || 'Unnamed'}" timing: ${formatDuration(elapsedTime)})`;
    } else {
        currentTimerDisplay = ` (Current task timing: ${formatDuration(elapsedTime)})`;
    }
  }
  if (totalTaskLoggedTime === 0 && !isTimerActiveForThisTaskContext) {
    displayTotalTime = 'Not timed';
  }


  const glassEffectClass = currentTheme === 'glass' ? 'glass-effect' : '';
  const projectColor = project?.color || 'var(--neutral-project-color)';
  
  let taskItemClasses = `
    relative rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out
    flex flex-col 
    bg-[var(--bg-card)] border 
    ${task.isCompleted && !isDeleting ? 'opacity-70' : 'opacity-100'}
    ${task.isImportant && !isDeleting ? 'border-[var(--accent-important)] ring-2 ring-[var(--accent-important)]' : 'border-[var(--border-color)]'}
    ${glassEffectClass} 
  `; 
  if (isDragOver && !isDeleting) taskItemClasses += ' is-drop-hover ';
  if (isDeleting) taskItemClasses += ' animate-task-delete ';


  const textClasses = task.isCompleted && !isDeleting ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-accent)]';
  const descriptionBaseClasses = task.isCompleted && !isDeleting ? 'line-through text-slate-500' : 'text-[var(--text-secondary)]';


  const handleStartEditing = (field: 'name' | 'description') => {
    if (task.isCompleted || isDeleting) return;
    setEditingField(field);
    setInputValue(field === 'name' ? task.name : task.description || '');
    setIsActionsMenuOpen(false); 
  };

  const handleSaveInlineEdit = () => {
    if (!editingField || isDeleting) return;
    const trimmedValue = inputValue.trim();
    if (editingField === 'name' && !trimmedValue) {
      alert("Task name cannot be empty.");
      setInputValue(task.name); 
      setEditingField(null);
      return;
    }
    if ((editingField === 'name' && trimmedValue !== task.name) || 
        (editingField === 'description' && trimmedValue !== (task.description || ''))) {
      onUpdateTaskInline(task.id, { [editingField]: trimmedValue });
    }
    setEditingField(null);
  };

  const handleCancelInlineEdit = () => {
    setEditingField(null);
    setInputValue(''); 
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isDeleting) return;
    if (e.key === 'Escape') {
      handleCancelInlineEdit();
    } else if (e.key === 'Enter') {
      if (editingField === 'name' || (editingField === 'description' && !e.shiftKey)) { 
        handleSaveInlineEdit();
        e.preventDefault(); 
      }
    }
  };
  

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDeleting || editingField || task.isCompleted || isSubtasksOpen) { 
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDraggingState(true);
    setTimeout(() => {
      if (draggableItemRef.current) {
        draggableItemRef.current.classList.add('opacity-50');
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDraggingState(false);
    if (draggableItemRef.current) {
      draggableItemRef.current.classList.remove('opacity-50');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDeleting) return;
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDeleting) return;
    e.preventDefault();
    const draggedItemId = e.dataTransfer.types.includes('text/plain') ? e.dataTransfer.getData('text/plain') : null;
    if (draggableItemRef.current && draggedItemId !== task.id) { 
      setIsDragOver(true);
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (draggableItemRef.current && !draggableItemRef.current.contains(e.relatedTarget as Node)) {
        setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDeleting) return;
    e.preventDefault();
    e.stopPropagation(); 
    const draggedTaskId = e.dataTransfer.getData('text/plain');
    if (draggedTaskId && draggedTaskId !== task.id) {
      onReorderTask(draggedTaskId, task.id);
    }
    setIsDragOver(false);
  };
  
  const menuActionItemClass = "w-full text-left px-3 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-button-hover)] flex items-center space-x-2 transition-colors";

  const handleAddSubTask = () => {
    if (newSubTaskName.trim() && !task.isCompleted && !isDeleting) {
      onAddSubTask(task.id, newSubTaskName.trim());
      setNewSubTaskName('');
      if (!isSubtasksOpen) setIsSubtasksOpen(true); 
    }
  };
  
  const handleSubTaskInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddSubTask();
    }
  };

  const sortedSubTasks = task.subTasks ? [...task.subTasks].sort((a,b) => a.order - b.order) : [];

  const isMainTimerActive = isTimerActiveForThisTaskContext && !activeTimer?.subTaskId;
  const canStartMainTimer = !activeTimer && !task.isCompleted && !isDeleting;


  return (
    <div 
      ref={draggableItemRef}
      className={taskItemClasses}
      style={{ 
        boxShadow: isDeleting ? 'none' : `0 4px 6px -1px var(--shadow-color-soft), 0 2px 4px -1px var(--shadow-color-medium)` 
      }}
      draggable={!editingField && !task.isCompleted && !isDeleting && !isSubtasksOpen} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 cursor-grab" 
        style={{ 
          backgroundColor: isDeleting 
            ? 'transparent' 
            : task.isImportant 
              ? 'var(--accent-important)' 
              : projectColor 
        }}
        title={
          isDeleting 
            ? undefined 
            : task.isImportant 
              ? 'Important Task' 
              : (project ? `Project: ${project.name}` : undefined)
        }
      ></div>
      
      {/* Main Task Content Area */}
      <div className="p-4 pl-6 flex justify-between items-start"> {/* pl-6 for color bar space */}
        
        {/* Left Column: Checkbox, Star, Task Info */}
        <div className="flex-grow min-w-0 flex items-start">
            {/* Checkbox and Star Column */}
            <div className="mr-3 flex flex-col items-center pt-1 space-y-1">
                <button
                    onClick={() => !isDeleting && onToggleComplete(task.id)}
                    className={`p-0.5 rounded 
                                ${task.isCompleted && !isDeleting ? 'text-[var(--button-start-bg)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'} 
                                transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-secondary)]
                                ${isDeleting ? 'cursor-default opacity-50' : ''}`}
                    title={task.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                    aria-pressed={task.isCompleted}
                    disabled={isDeleting}
                >
                    {task.isCompleted && !isDeleting ? <CheckboxCheckedIcon className="w-5 h-5" /> : <CheckboxIcon className="w-5 h-5" />}
                </button>
                <button
                    onClick={() => !isDeleting && onToggleImportant(task.id)}
                    className={`p-1.5 rounded-full transition-colors 
                                ${task.isImportant && !isDeleting ? 'text-[var(--accent-important)] hover:opacity-80' : 'text-[var(--text-secondary)] hover:text-[var(--accent-important)]'}
                                ${isDeleting ? 'cursor-default opacity-50' : ''}`}
                    title={task.isImportant ? "Unmark as important" : "Mark as important"}
                    aria-pressed={task.isImportant}
                    disabled={isDeleting}
                >
                    {task.isImportant && !isDeleting ? <StarFilledIcon className="w-4 h-4" /> : <StarIcon className="w-4 h-4" />}
                </button>
            </div>

            {/* Text Content Area (Name, Project, Description, Logged Time) */}
            <div className="flex-grow min-w-0">
                {editingField === 'name' && !isDeleting ? (
                    <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleSaveInlineEdit}
                    onKeyDown={handleKeyDown}
                    className={`w-full text-lg font-semibold bg-transparent border-b border-[var(--accent-secondary)] focus:outline-none ${textClasses}`}
                    autoFocus
                    />
                ) : (
                    <h3 
                    className={`text-lg font-semibold truncate ${textClasses} ${task.isCompleted || isDeleting || editingField ? 'pointer-events-none' : 'cursor-pointer'}`} 
                    title={task.name}
                    onClick={() => !isDeleting && handleStartEditing('name')}
                    >
                    {task.name}
                    </h3>
                )}

                {project && <p className={`text-xs font-medium mt-0.5 ${task.isCompleted && !isDeleting ? 'line-through' : ''}`} style={{color: task.isImportant ? 'var(--accent-important)' : projectColor}}>{project.name}</p>}
                {abacusCode && <p className={`text-xs mt-0.5 ${descriptionBaseClasses}`} title={`Abacus: ${abacusCode.code}`}>Abacus: {abacusCode.code}</p>}
                
                {editingField === 'description' && !isDeleting ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={handleSaveInlineEdit}
                        onKeyDown={handleKeyDown}
                        className={`w-full text-sm mt-1 bg-transparent border-b border-[var(--accent-secondary)] focus:outline-none themed-scrollbar resize-none ${descriptionBaseClasses}`}
                        rows={2}
                        autoFocus
                    />
                ) : (
                    task.description && (
                        <p 
                            className={`text-sm mt-1 break-words whitespace-pre-wrap ${descriptionBaseClasses} ${task.isCompleted || isDeleting || editingField ? 'pointer-events-none' : 'cursor-pointer'}`} 
                            title={task.description}
                            onClick={() => !isDeleting && handleStartEditing('description')}
                        >
                            {task.description}
                        </p>
                    )
                )}
                {!task.description && !editingField && !task.isCompleted && !isDeleting && (
                    <p 
                        className={`text-sm mt-1 italic cursor-pointer text-[var(--text-placeholder)] hover:text-[var(--text-secondary)] ${task.isCompleted || isDeleting ? 'pointer-events-none' : ''}`}
                        onClick={() => !isDeleting && handleStartEditing('description')}
                    >
                        Add description...
                    </p>
                )}
                
                <div className={`text-xs mt-2 ${descriptionBaseClasses}`}>
                    <span>Total Logged: {displayTotalTime}</span>
                    {currentTimerDisplay && <span className="block sm:inline sm:ml-2">{currentTimerDisplay}</span>}
                </div>
            </div>
        </div>
        
        {/* Right Column: Timer and Actions Menu */}
        <div className="flex items-center space-x-1 flex-shrink-0 ml-2 pt-0.5">
            {isMainTimerActive && !isDeleting ? (
                <button
                onClick={() => onStopTimer(task.id)}
                className="p-2 text-white rounded-full transition-colors flex items-center disabled:opacity-50"
                style={{ backgroundColor: 'var(--button-stop-bg)', border: '1px solid var(--button-stop-border)'}}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--button-stop-hover-bg)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--button-stop-bg)'}
                title="Stop Main Task Timer" aria-label="Stop Main Task Timer"
                >
                <StopIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            ) : (
                <button
                onClick={() => !isDeleting && onStartTimer(task.id)} // Main task timer, no subTaskId
                className="p-2 text-white rounded-full transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--button-start-bg)', border: '1px solid var(--button-start-border)'}}
                onMouseOver={(e) => canStartMainTimer && (e.currentTarget.style.backgroundColor = 'var(--button-start-hover-bg)')}
                onMouseOut={(e) => canStartMainTimer && (e.currentTarget.style.backgroundColor = 'var(--button-start-bg)')}
                title="Start Main Task Timer" aria-label="Start Main Task Timer"
                disabled={!canStartMainTimer || Boolean(activeTimer?.subTaskId)} // Also disable if a sub-task timer is running for THIS task
                >
                <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            )}
            
            <div className="relative">
                <button
                    ref={menuTriggerRef}
                    onClick={() => !isDeleting && setIsActionsMenuOpen(prev => !prev)}
                    className={`p-1.5 sm:p-2 text-[var(--text-secondary)] hover:text-[var(--text-accent)] rounded-full transition-colors ${isDeleting ? 'cursor-default opacity-50' : ''}`}
                    title="More actions"
                    aria-haspopup="true"
                    aria-expanded={isActionsMenuOpen}
                    aria-controls={`task-actions-menu-${task.id}`}
                    disabled={isDeleting}
                >
                    <EllipsisVerticalIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
                </button>
                {isActionsMenuOpen && !isDeleting && (
                    <div
                        ref={menuRef}
                        id={`task-actions-menu-${task.id}`}
                        role="menu"
                        className={`absolute right-0 mt-2 w-48 z-20 rounded-md shadow-xl
                                    bg-[var(--bg-dropdown)] border border-[var(--border-color)] ${glassEffectClass}
                                    py-1 focus:outline-none themed-scrollbar max-h-60 overflow-y-auto`}
                    >
                        <button role="menuitem" onClick={() => { onOpenManualTimeModal(task); setIsActionsMenuOpen(false); }} className={menuActionItemClass}>
                            <ClockIcon className="w-4 h-4 mr-2" /> Adjust Main Task Time
                        </button>
                        <button role="menuitem" onClick={() => { onSaveAsFavorite(task); setIsActionsMenuOpen(false); }} className={menuActionItemClass}>
                            <BookmarkIcon className="w-4 h-4 mr-2" /> Save as Favorite
                        </button>
                        <button role="menuitem" onClick={() => { onCopyTask(task); setIsActionsMenuOpen(false); }} className={menuActionItemClass}>
                            <CopyIcon className="w-4 h-4 mr-2" /> Copy Task
                        </button>
                        <button role="menuitem" onClick={() => { onMoveTask(task); setIsActionsMenuOpen(false); }} className={menuActionItemClass}>
                            <MoveIcon className="w-4 h-4 mr-2" /> Move Task
                        </button>
                        <button role="menuitem" onClick={() => { onEditTask(task); setIsActionsMenuOpen(false); }} className={menuActionItemClass}>
                            <EditIcon className="w-4 h-4 mr-2" /> Edit Task (Full)
                        </button>
                        <div className="my-1 h-px bg-[var(--border-color)]"></div> {/* Separator */}
                        <button role="menuitem" onClick={() => { onDeleteTask(task.id); setIsActionsMenuOpen(false); }} className={`${menuActionItemClass} text-[var(--button-stop-bg)] hover:text-white hover:bg-[var(--button-stop-hover-bg)]`}>
                            <TrashIcon className="w-4 h-4 mr-2" /> Delete Task
                        </button>
                    </div>
                )}
            </div>
        </div> {/* End Right Column */}
      </div> {/* End Main Task Content Area p-4 pl-6 div */}

      {/* Sub-tasks Section */}
      {!isDeleting && (
        <div className="border-t border-[var(--border-color)]">
          <button 
            onClick={() => setIsSubtasksOpen(!isSubtasksOpen)}
            className="w-full flex justify-between items-center px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-button-hover)] transition-colors"
            aria-expanded={isSubtasksOpen}
            aria-controls={`subtasks-content-${task.id}`}
          >
            <span>Sub-tasks ({sortedSubTasks.length})</span>
            {isSubtasksOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </button>

          {isSubtasksOpen && (
            <div id={`subtasks-content-${task.id}`} className="px-4 pb-3 pt-1 space-y-2 bg-[var(--bg-input)] border-t border-[var(--border-color)]">
              {sortedSubTasks.length > 0 && (
                <ul className="space-y-1.5 max-h-40 overflow-y-auto themed-scrollbar pr-1">
                  {sortedSubTasks.map(subTask => {
                    const isSubTaskTimerActive = activeTimer?.taskId === task.id && activeTimer?.subTaskId === subTask.id;
                    const canStartSubTaskTimer = !activeTimer && !task.isCompleted && !subTask.isCompleted && !isDeleting;
                    const subTaskElapsedTime = isSubTaskTimerActive ? elapsedTime : 0;

                    return (
                    <li key={subTask.id} className="flex items-center space-x-2 py-1">
                      <button
                        onClick={() => !task.isCompleted && onToggleSubTaskComplete(task.id, subTask.id)}
                        className={`p-0.5 rounded 
                                    ${subTask.isCompleted ? 'text-[var(--button-start-bg)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}
                                    ${task.isCompleted || isDeleting ? 'cursor-default opacity-60' : ''}`}
                        title={subTask.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                        aria-pressed={subTask.isCompleted}
                        disabled={task.isCompleted || isDeleting}
                      >
                        {subTask.isCompleted ? <CheckboxCheckedIcon className="w-4 h-4" /> : <CheckboxIcon className="w-4 h-4" />}
                      </button>
                      
                      <div className="flex-grow text-sm">
                        <span className={`${subTask.isCompleted ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-main)]'}`}>
                            {subTask.name}
                        </span>
                        <div className={`text-xs ${subTask.isCompleted ? 'text-slate-500' : 'text-[var(--text-secondary)]'}`}>
                            Logged: {formatDuration(subTask.timeLogged)}
                            {isSubTaskTimerActive && ` (Timing: ${formatDuration(subTaskElapsedTime)})`}
                        </div>
                      </div>

                      {isSubTaskTimerActive ? (
                        <button
                            onClick={() => onStopSubTaskTimer(task.id, subTask.id)}
                            className="p-1 text-white rounded-full transition-colors flex items-center"
                            style={{ backgroundColor: 'var(--button-stop-bg)', border: '1px solid var(--button-stop-border)', fontSize: '0.7rem' }}
                            title="Stop Sub-task Timer"
                        > <StopIcon className="w-3 h-3" /> </button>
                      ) : (
                        <button
                            onClick={() => onStartSubTaskTimer(task.id, subTask.id)}
                            className="p-1 text-white rounded-full transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: 'var(--button-start-bg)', border: '1px solid var(--button-start-border)', fontSize: '0.7rem' }}
                            title="Start Sub-task Timer"
                            disabled={!canStartSubTaskTimer}
                        > <PlayIcon className="w-3 h-3" /> </button>
                      )}

                      <button
                        onClick={() => !task.isCompleted && onDeleteSubTask(task.id, subTask.id)}
                        className={`p-1 text-[var(--text-secondary)] hover:text-[var(--button-stop-bg)] transition-colors rounded-full ${task.isCompleted || isDeleting ? 'cursor-default opacity-60' : ''}`}
                        title="Delete sub-task"
                        disabled={task.isCompleted || isDeleting}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </li>
                  );
                  })}
                </ul>
              )}
              
              <div className={`flex items-center space-x-2 pt-2 ${task.isCompleted || isDeleting ? 'opacity-60' : ''}`}>
                <input
                  ref={subTaskInputRef}
                  type="text"
                  value={newSubTaskName}
                  onChange={(e) => setNewSubTaskName(e.target.value)}
                  onKeyDown={handleSubTaskInputKeyDown}
                  placeholder="Add new sub-task..."
                  className="flex-grow px-2.5 py-1.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-main)] placeholder-[var(--text-placeholder)] focus:ring-1 focus:ring-[var(--border-input-focus)] focus:border-[var(--border-input-focus)]"
                  disabled={task.isCompleted || isDeleting}
                />
                <button
                  onClick={handleAddSubTask}
                  className="p-1.5 bg-[var(--accent-secondary)] text-[var(--text-on-accent)] rounded-md hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Add sub-task"
                  disabled={!newSubTaskName.trim() || task.isCompleted || isDeleting}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem;