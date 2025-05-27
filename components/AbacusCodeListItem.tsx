
import React from 'react';
import { AbacusCode, Theme } from '../types'; // Removed ViewMode
import { EditIcon, TrashIcon } from '../constants';

interface AbacusCodeListItemProps {
  abacusCode: AbacusCode;
  onEditAbacusCode: (abacusCode: AbacusCode) => void;
  onDeleteAbacusCode: (abacusCodeId: string) => void;
  currentTheme: Theme;
  // viewMode?: ViewMode; // Removed
}

const AbacusCodeListItem: React.FC<AbacusCodeListItemProps> = ({ abacusCode, onEditAbacusCode, onDeleteAbacusCode, currentTheme }) => {
  const glassEffectClass = currentTheme === 'glass' ? 'glass-effect' : '';

  return (
    <div 
      className={`p-4 rounded-lg shadow-lg flex justify-between items-center
                 bg-[var(--bg-card)] border border-[var(--border-color)] ${glassEffectClass}`}
      style={{ boxShadow: `0 4px 6px -1px var(--shadow-color-soft), 0 2px 4px -1px var(--shadow-color-medium)` }}
    >
      <div className="flex-grow min-w-0">
        <h3 className="text-lg font-semibold text-[var(--text-accent)] truncate" title={abacusCode.code}>{abacusCode.code}</h3>
        {/* Description display removed */}
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
        <button
          onClick={() => onEditAbacusCode(abacusCode)}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-accent)] transition-colors"
          title="Edit Abacus Code"
          aria-label={`Edit Abacus code ${abacusCode.code}`}
        >
          <EditIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDeleteAbacusCode(abacusCode.id)}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--button-stop-bg)] transition-colors"
          title="Delete Abacus Code"
          aria-label={`Delete Abacus code ${abacusCode.code}`}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AbacusCodeListItem;