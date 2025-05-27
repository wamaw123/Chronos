
import React, { useState, useEffect } from 'react';
import { Project, Theme, ProjectFormModalProps } from '../types'; // Updated import
import { generateId } from '../utils/idUtils';
import Modal from './Modal';

// Re-declare props locally if not using the one from types.ts directly, or ensure types.ts is correctly imported/used.
// For this example, assuming ProjectFormModalProps from types.ts is used.

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen, onClose, onSaveProject, existingProject, currentTheme
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1'); // Default to a pleasant indigo

  useEffect(() => {
    if (isOpen) { // Reset form only when modal opens
      if (existingProject) {
        setName(existingProject.name);
        setColor(existingProject.color);
      } else {
        setName('');
        setColor('#6366f1'); // Default color for new project
      }
    }
  }, [existingProject, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Project name cannot be empty.");
      return;
    }
    const projectData: Project = {
      id: existingProject?.id || generateId(),
      name: name.trim(),
      color: color,
    };
    onSaveProject(projectData, !existingProject); // Pass isNew flag
    onClose(); // Close modal after saving
  };

  if (!isOpen) return null; // Ensure modal doesn't render if not open

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingProject ? 'Edit Project' : 'Add New Project'} currentTheme={currentTheme}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Project Name</label>
          <input
            type="text"
            id="projectName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md shadow-sm 
                       text-[var(--text-main)] placeholder-[var(--text-placeholder)] 
                       focus:ring-1 focus:ring-[var(--border-input-focus)] focus:border-[var(--border-input-focus)] sm:text-sm"
            placeholder="Enter project name"
            required
          />
        </div>
        <div>
          <label htmlFor="projectColor" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Project Color</label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              id="projectColor"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              // Basic styling for the color input itself. More advanced styling is browser-dependent.
              className="w-12 h-10 p-0 border-none rounded-md cursor-pointer bg-[var(--bg-input)]" 
              title="Select project color"
            />
            <input 
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md shadow-sm text-[var(--text-main)] sm:text-sm"
              placeholder="Hex color e.g. #6366f1"
            />
          </div>
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
            type="submit"
            className="px-4 py-2 text-sm font-medium text-[var(--text-on-accent)] bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] 
                       rounded-md transition-colors border border-[var(--accent-primary)]"
          >
            {existingProject ? 'Save Changes' : 'Add Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectFormModal;
