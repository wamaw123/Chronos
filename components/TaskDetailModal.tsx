
import React from 'react';
import { TaskDetailModalProps } from '../types';
import Modal from './Modal';
import { formatDuration, formatDate }
from '../utils/dateUtils';
import { CheckboxIcon, CheckboxCheckedIcon, StarIcon, StarFilledIcon } from '../constants';

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  project,
  abacusCode,
  timeEntriesForTaskOnDate,
  currentTheme,
}) => {
  if (!isOpen || !task) return null;

  const totalTimeLoggedForTaskOnDate = timeEntriesForTaskOnDate.reduce((sum, entry) => sum + entry.duration, 0);

  const glassEffectClass = currentTheme === 'glass' ? 'glass-effect' : '';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details" currentTheme={currentTheme}>
      <div className={`space-y-4 p-1 ${glassEffectClass}`}>
        <div>
          <h3 className="text-xl font-semibold text-[var(--text-accent)] break-words">{task.name}</h3>
          {task.description && (
            <p className="mt-1 text-sm text-[var(--text-secondary)] whitespace-pre-wrap break-words">{task.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="font-medium text-[var(--text-secondary)]">Date:</span>
            <p className="text-[var(--text-main)]">{formatDate(new Date(task.date + 'T00:00:00'), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div>
            <span className="font-medium text-[var(--text-secondary)]">Status:</span>
            <div className="flex items-center mt-0.5">
              {task.isCompleted ? (
                <CheckboxCheckedIcon className="w-5 h-5 text-[var(--button-start-bg)] mr-1" />
              ) : (
                <CheckboxIcon className="w-5 h-5 text-[var(--text-secondary)] mr-1" />
              )}
              <span className={`text-[var(--text-main)] ${task.isCompleted ? 'line-through' : ''}`}>
                {task.isCompleted ? 'Completed' : 'Active'}
              </span>
            </div>
          </div>
          
          {project && (
            <div>
              <span className="font-medium text-[var(--text-secondary)]">Project:</span>
              <div className="flex items-center">
                <span 
                  className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                  style={{ backgroundColor: project.color }}
                  title={`Project color: ${project.color}`}
                ></span>
                <p className="text-[var(--text-main)]" style={{color: project.color}}>{project.name}</p>
              </div>
            </div>
          )}

          <div>
            <span className="font-medium text-[var(--text-secondary)]">Importance:</span>
            <div className="flex items-center mt-0.5">
              {task.isImportant ? (
                <StarFilledIcon className="w-5 h-5 text-yellow-400 mr-1" />
              ) : (
                <StarIcon className="w-5 h-5 text-[var(--text-secondary)] mr-1" />
              )}
              <span className="text-[var(--text-main)]">
                {task.isImportant ? 'Important' : 'Normal'}
              </span>
            </div>
          </div>

          {abacusCode && (
            <div>
              <span className="font-medium text-[var(--text-secondary)]">Abacus Code:</span>
              <p className="text-[var(--text-main)]">{abacusCode.code}</p>
            </div>
          )}
          
          <div>
            <span className="font-medium text-[var(--text-secondary)]">Total Time Logged on Date:</span>
            <p className="text-[var(--text-main)] font-semibold">{formatDuration(totalTimeLoggedForTaskOnDate)}</p>
          </div>
        </div>
        
        {timeEntriesForTaskOnDate.length > 0 && (
            <div className="pt-2">
                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-1">Time Entries:</h4>
                <ul className="text-xs text-[var(--text-secondary)] space-y-1 max-h-32 overflow-y-auto themed-scrollbar pr-2">
                    {timeEntriesForTaskOnDate.slice().sort((a,b) => a.startTime - b.startTime).map(entry => (
                        <li key={entry.id} className={`p-1.5 rounded border`} style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.05)'}}>
                           {new Date(entry.startTime).toLocaleTimeString()} - {new Date(entry.endTime).toLocaleTimeString()} ({formatDuration(entry.duration)})
                           {entry.notes && <span className="block italic text-[0.65rem] opacity-75">{entry.notes}</span>}
                        </li>
                    ))}
                </ul>
            </div>
        )}


        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[var(--text-main)] bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] 
                       rounded-md transition-colors border border-[var(--border-color)]"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;