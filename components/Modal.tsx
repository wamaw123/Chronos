
import React from 'react';
import { ModalProps } from '../types'; // Use ModalProps from types.ts

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, currentTheme }) => {
  if (!isOpen) return null;

  const glassEffectClass = currentTheme === 'glass' ? 'glass-effect' : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div 
        className={`p-5 sm:p-6 rounded-lg shadow-xl w-full max-w-md 
                   bg-[var(--bg-modal)] border border-[var(--border-color)] ${glassEffectClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-lg sm:text-xl font-semibold text-[var(--text-accent)]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors p-1 -mr-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-secondary)]"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;