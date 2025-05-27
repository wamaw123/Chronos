
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Theme, ViewMode } from '../types'; 
import { getLocalISODateString, formatDate } from '../utils/dateUtils'; // Changed to getLocalISODateString
import { CalendarIcon } from '../constants';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void; // YYYY-MM-DD (local)
  title: string;
  currentTheme: Theme;
  viewMode?: ViewMode; 
  initialDate?: string; // YYYY-MM-DD (local)
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ isOpen, onClose, onDateSelect, title, currentTheme, initialDate }) => {
  // Ensure selectedDate is always a local YYYY-MM-DD string
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || getLocalISODateString(new Date()));

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(initialDate || getLocalISODateString(new Date()));
    }
  }, [isOpen, initialDate]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value); // Value from input type="date" is YYYY-MM-DD local
  };

  const handleSubmit = () => {
    if (selectedDate) {
      onDateSelect(selectedDate);
    } else {
      alert("Please select a date.");
    }
  };
  
  const displayDate = selectedDate 
    ? formatDate(new Date(selectedDate + 'T00:00:00'), { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) 
    : 'Select a date';


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} currentTheme={currentTheme}>
      <div className="space-y-4">
        <div className="relative">
            <label htmlFor="date-picker" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Select Target Date
            </label>
             <div className="flex items-center bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md shadow-sm">
                <span className="pl-3">
                    <CalendarIcon className="w-5 h-5 text-[var(--text-secondary)]"/>
                </span>
                <input
                    type="date"
                    id="date-picker"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 bg-transparent text-[var(--text-main)] 
                               focus:ring-0 focus:border-transparent border-none sm:text-sm"
                />
            </div>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Selected: <span className="font-medium text-[var(--text-main)]">{displayDate}</span>
            </p>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[var(--text-main)] bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] 
                       rounded-md transition-colors border border-[var(--border-color)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-[var(--text-on-accent)] bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] 
                       rounded-md transition-colors border border-[var(--accent-primary)]"
            disabled={!selectedDate}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DatePickerModal;