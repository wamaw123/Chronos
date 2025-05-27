import React, { useState } from 'react';
import { Project, ProjectManagementViewProps } from '../types';
import ProjectListItem from './ProjectListItem';
import { PlusIcon } from '../constants';

const ProjectManagementView: React.FC<ProjectManagementViewProps> = ({
  projects, onSaveNewProjectInline, onEditProject, onDeleteProject, currentTheme
}) => {
  const glassEffectClass = currentTheme === 'glass' ? 'glass-effect' : '';
  
  const [showInlineCreateForm, setShowInlineCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#6366f1');

  const handleToggleInlineForm = () => {
    setShowInlineCreateForm(prev => !prev);
    if (!showInlineCreateForm) { // Reset when opening
        setNewProjectName('');
        setNewProjectColor('#6366f1');
    }
  };

  const handleSaveNewProject = () => {
    if (!newProjectName.trim()) {
      alert("Project name cannot be empty.");
      return;
    }
    onSaveNewProjectInline(newProjectName.trim(), newProjectColor);
    setNewProjectName('');
    setNewProjectColor('#6366f1');
    setShowInlineCreateForm(false); // Hide form after saving
  };

  const handleCancelInlineProject = () => {
    setShowInlineCreateForm(false);
    setNewProjectName('');
    setNewProjectColor('#6366f1');
  }

  return (
    <div 
      className={`p-4 sm:p-6 rounded-lg shadow-xl max-h-[85vh] flex flex-col bg-transparent border-none ${glassEffectClass}`}
    >
      {/* Inline form for adding a new project, shown conditionally */}
      {showInlineCreateForm && (
        <div className={`p-4 mb-6 rounded-lg shadow-md bg-[var(--bg-input)] border border-[var(--border-color)] ${glassEffectClass} space-y-3`}>
          <h3 className="text-lg font-medium text-[var(--text-main)]">Add New Project</h3>
          <div>
            <label htmlFor="managementNewProjectName" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Project Name *</label>
            <input
              type="text" id="managementNewProjectName" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md text-[var(--text-main)] placeholder-[var(--text-placeholder)] focus:ring-1 focus:ring-[var(--border-input-focus)] focus:border-[var(--border-input-focus)] sm:text-sm"
              placeholder="Enter project name" autoFocus
            />
          </div>
          <div>
            <label htmlFor="managementNewProjectColor" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Project Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color" id="managementNewProjectColor" value={newProjectColor} onChange={(e) => setNewProjectColor(e.target.value)}
                className="w-12 h-10 p-0 border-none rounded-md cursor-pointer bg-[var(--bg-input)]"
                title="Select project color"
              />
              <input type="text" value={newProjectColor} onChange={(e) => setNewProjectColor(e.target.value)}
                className="flex-grow px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md text-[var(--text-main)] sm:text-sm"
                placeholder="Hex color e.g. #6366f1"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={handleCancelInlineProject} className="px-3 py-1.5 text-sm text-[var(--text-main)] bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] rounded-md">Cancel</button>
            <button type="button" onClick={handleSaveNewProject} className="px-3 py-1.5 text-sm text-[var(--text-on-accent)] bg-[var(--accent-secondary)] hover:bg-[var(--accent-primary-hover)] rounded-md">Save Project</button>
          </div>
        </div>
      )}
      
      {/* List of existing projects */}
      <div className={`flex-grow overflow-y-auto themed-scrollbar pr-1 space-y-4 ${showInlineCreateForm ? 'mt-4 pt-4 border-t border-[var(--border-color)]' : ''}`}>
        {projects.length === 0 && !showInlineCreateForm && (
          <p className="text-center text-[var(--text-secondary)] py-8">No projects yet. Click "Add New Project" below.</p>
        )}
        {projects.map(project => (
          <ProjectListItem
            key={project.id}
            project={project}
            onEditProject={onEditProject}
            onDeleteProject={onDeleteProject}
            currentTheme={currentTheme}
          />
        ))}
      </div>

      {/* "Add New Project" button at the bottom if form is not shown */}
      {!showInlineCreateForm && (
        <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex justify-center">
          <button 
            type="button" 
            onClick={handleToggleInlineForm} 
            className="flex items-center px-4 py-2 text-sm font-medium text-[var(--text-on-accent)] bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] rounded-md transition-colors border border-[var(--accent-primary)] shadow-md"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectManagementView;