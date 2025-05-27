
import React, { useState, useEffect } from 'react';
import { AbacusCode, AbacusCodeFormModalProps } from '../types';
import { generateId } from '../utils/idUtils';
import Modal from './Modal';

const AbacusCodeFormModal: React.FC<AbacusCodeFormModalProps> = ({
  isOpen, onClose, onSaveAbacusCode, existingAbacusCode, currentTheme
}) => {
  const [code, setCode] = useState('');
  // description state removed

  useEffect(() => {
    if (isOpen) { // Reset form only when modal opens
      if (existingAbacusCode) {
        setCode(existingAbacusCode.code);
        // description reset removed
      } else {
        setCode('');
        // description reset removed
      }
    }
  }, [existingAbacusCode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert("Abacus code cannot be empty.");
      return;
    }
    const abacusCodeData: AbacusCode = {
      id: existingAbacusCode?.id || generateId(),
      code: code.trim(),
      // description removed from data object
    };
    onSaveAbacusCode(abacusCodeData, !existingAbacusCode);
    onClose(); // Close modal after saving
  };

  if (!isOpen) return null; // Ensure modal doesn't render if not open

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingAbacusCode ? 'Edit Abacus Code' : 'Add New Abacus Code'} currentTheme={currentTheme}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="abacusCodeValue" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Abacus Code</label>
          <input
            type="text"
            id="abacusCodeValue"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md shadow-sm 
                       text-[var(--text-main)] placeholder-[var(--text-placeholder)] 
                       focus:ring-1 focus:ring-[var(--border-input-focus)] focus:border-[var(--border-input-focus)] sm:text-sm"
            placeholder="Enter Abacus code"
            required
          />
        </div>
        {/* Description textarea and label removed */}
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
            type="submit"
            className="px-4 py-2 text-sm font-medium text-[var(--text-on-accent)] bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] 
                       rounded-md transition-colors border border-[var(--accent-primary)]"
          >
            {existingAbacusCode ? 'Save Changes' : 'Add Abacus Code'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AbacusCodeFormModal;