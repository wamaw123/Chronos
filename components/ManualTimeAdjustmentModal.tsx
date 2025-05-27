
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { ManualTimeAdjustmentModalProps, TimeEntry } from '../types';
import { formatDuration, getLocalISODateString } from '../utils/dateUtils';

const ManualTimeAdjustmentModal: React.FC<ManualTimeAdjustmentModalProps> = ({
  isOpen, onClose, onApplyAdjustment, task, currentTheme, timeEntries
}) => {
  const [hours, setHours] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [adjustmentMode, setAdjustmentMode] = useState<'add' | 'subtract'>('add');

  useEffect(() => {
    if (isOpen) {
      setHours('');
      setMinutes('');
      setAdjustmentMode('add');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numHours = parseInt(hours, 10) || 0;
    const numMinutes = parseInt(minutes, 10) || 0;

    if (numHours < 0 || numMinutes < 0) {
      alert("Time values cannot be negative.");
      return;
    }
    if (numHours === 0 && numMinutes === 0) {
      alert("Please enter a time to adjust.");
      return;
    }
    onApplyAdjustment(numHours, numMinutes, adjustmentMode);
    onClose();
  };

  const calculateTaskTotalTimeOnDate = () => {
    if (!task) return 0;
    return timeEntries
      .filter(entry => entry.taskId === task.id && getLocalISODateString(new Date(entry.startTime)) === task.date)
      .reduce((sum, entry) => sum + entry.duration, 0);
  };
  
  const currentTaskTotalTime = task ? calculateTaskTotalTimeOnDate() : 0;


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adjust Time for: ${task?.name || ''}`} currentTheme={currentTheme}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {task && (
          <p className="text-sm text-[var(--text-secondary)]">
            Current total time for '{task.name}' on {new Date(task.date + 'T00:00:00').toLocaleDateString()}: 
            <span className="font-semibold text-[var(--text-main)]"> {formatDuration(currentTaskTotalTime)}</span>
          </p>
        )}
        <div className="flex space-x-3">
          <div>
            <label htmlFor="adjHours" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Hours</label>
            <input
              type="number" id="adjHours" value={hours} onChange={(e) => setHours(e.target.value)}
              min="0"
              className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md shadow-sm text-[var(--text-main)] placeholder-[var(--text-placeholder)] focus:ring-1 focus:ring-[var(--border-input-focus)] focus:border-[var(--border-input-focus)] sm:text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="adjMinutes" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Minutes</label>
            <input
              type="number" id="adjMinutes" value={minutes} onChange={(e) => setMinutes(e.target.value)}
              min="0" max="59"
              className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md shadow-sm text-[var(--text-main)] placeholder-[var(--text-placeholder)] focus:ring-1 focus:ring-[var(--border-input-focus)] focus:border-[var(--border-input-focus)] sm:text-sm"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Action</span>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="adjustmentMode" value="add" checked={adjustmentMode === 'add'} 
                     onChange={() => setAdjustmentMode('add')} 
                     className="form-radio h-4 w-4 text-[var(--accent-primary)] bg-[var(--bg-input)] border-[var(--border-color)] focus:ring-[var(--accent-secondary)]"/>
              <span className="text-[var(--text-main)]">Add Time</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="adjustmentMode" value="subtract" checked={adjustmentMode === 'subtract'}
                     onChange={() => setAdjustmentMode('subtract')}
                     className="form-radio h-4 w-4 text-[var(--accent-primary)] bg-[var(--bg-input)] border-[var(--border-color)] focus:ring-[var(--accent-secondary)]"/>
              <span className="text-[var(--text-main)]">Subtract Time</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[var(--text-main)] bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] rounded-md transition-colors border border-[var(--border-color)]">
            Cancel
          </button>
          <button type="submit"
            className="px-4 py-2 text-sm font-medium text-[var(--text-on-accent)] bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] rounded-md transition-colors border border-[var(--accent-primary)]">
            Apply Adjustment
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ManualTimeAdjustmentModal;