
import React, { useState } from 'react';
import { AbacusCode, AbacusCodeManagementViewProps } from '../types';
import AbacusCodeListItem from './AbacusCodeListItem';
import { PlusIcon } from '../constants';

const AbacusCodeManagementView: React.FC<AbacusCodeManagementViewProps> = ({
  abacusCodes, onSaveNewAbacusCodeInline, onEditAbacusCode, onDeleteAbacusCode, currentTheme
}) => {
  const glassEffectClass = currentTheme === 'glass' ? 'glass-effect' : '';
  
  const [showInlineCreateForm, setShowInlineCreateForm] = useState(false);
  const [newAbacusCodeValue, setNewAbacusCodeValue] = useState('');
  // newAbacusDescription state removed

  const handleToggleInlineForm = () => {
    setShowInlineCreateForm(prev => !prev);
    if (!showInlineCreateForm) { // Reset when opening
      setNewAbacusCodeValue('');
      // newAbacusDescription reset removed
    }
  };

  const handleSaveNewAbacusCode = () => {
    if (!newAbacusCodeValue.trim()) {
      alert("Abacus code cannot be empty.");
      return;
    }
    onSaveNewAbacusCodeInline(newAbacusCodeValue.trim());
    setNewAbacusCodeValue('');
    // newAbacusDescription reset removed
    setShowInlineCreateForm(false); // Hide form after saving
  };

  const handleCancelInlineAbacusCode = () => {
    setShowInlineCreateForm(false);
    setNewAbacusCodeValue('');
    // newAbacusDescription reset removed
  };

  return (
    <div 
      className={`p-4 sm:p-6 rounded-lg shadow-xl max-h-[85vh] flex flex-col bg-transparent border-none ${glassEffectClass}`}
    >
      {/* Inline form for adding a new Abacus code, shown conditionally */}
      {showInlineCreateForm && (
        <div className={`p-4 mb-6 rounded-lg shadow-md bg-[var(--bg-input)] border border-[var(--border-color)] ${glassEffectClass} space-y-3`}>
          <h3 className="text-lg font-medium text-[var(--text-main)]">Add New Abacus Code</h3>
          <div>
            <label htmlFor="managementNewAbacusCodeValue" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Abacus Code *</label>
            <input
              type="text" id="managementNewAbacusCodeValue" value={newAbacusCodeValue} onChange={(e) => setNewAbacusCodeValue(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md text-[var(--text-main)] placeholder-[var(--text-placeholder)] focus:ring-1 focus:ring-[var(--border-input-focus)] focus:border-[var(--border-input-focus)] sm:text-sm"
              placeholder="Enter Abacus code" autoFocus
            />
          </div>
          {/* Description textarea and label removed */}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={handleCancelInlineAbacusCode} className="px-3 py-1.5 text-sm text-[var(--text-main)] bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] rounded-md">Cancel</button>
            <button type="button" onClick={handleSaveNewAbacusCode} className="px-3 py-1.5 text-sm text-[var(--text-on-accent)] bg-[var(--accent-secondary)] hover:bg-[var(--accent-primary-hover)] rounded-md">Save Abacus Code</button>
          </div>
        </div>
      )}

      {/* List of existing Abacus codes */}
      <div className={`flex-grow overflow-y-auto themed-scrollbar pr-1 space-y-4 ${showInlineCreateForm ? 'mt-4 pt-4 border-t border-[var(--border-color)]' : ''}`}>
        {abacusCodes.length === 0 && !showInlineCreateForm && (
          <p className="text-center text-[var(--text-secondary)] py-8">No Abacus codes yet. Click "Add New Abacus Code" below.</p>
        )}
        {abacusCodes.map(code => (
          <AbacusCodeListItem
            key={code.id}
            abacusCode={code}
            onEditAbacusCode={onEditAbacusCode}
            onDeleteAbacusCode={onDeleteAbacusCode}
            currentTheme={currentTheme}
          />
        ))}
      </div>

      {/* "Add New Abacus Code" button at the bottom if form is not shown */}
      {!showInlineCreateForm && (
        <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex justify-center">
          <button 
            type="button" 
            onClick={handleToggleInlineForm} 
            className="flex items-center px-4 py-2 text-sm font-medium text-[var(--text-on-accent)] bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] rounded-md transition-colors border border-[var(--accent-primary)] shadow-md"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Abacus Code
          </button>
        </div>
      )}
    </div>
  );
};

export default AbacusCodeManagementView;