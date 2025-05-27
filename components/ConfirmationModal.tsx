
import React from 'react';
import Modal from './Modal';
import { ConfirmationModalProps } from '../types';

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  currentTheme,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} currentTheme={currentTheme}>
      <div className="space-y-4">
        <p className="text-sm text-[var(--text-secondary)]">{message}</p>
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
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-[var(--button-stop-bg)] hover:bg-[var(--button-stop-hover-bg)] 
                       rounded-md transition-colors border border-[var(--button-stop-border)]"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;