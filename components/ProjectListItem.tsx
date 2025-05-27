
import React from 'react';
import { Project, Theme } from '../types'; // Removed ViewMode
import { EditIcon, TrashIcon } from '../constants';

interface ProjectListItemProps {
  project: Project;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  currentTheme: Theme;
  // viewMode?: ViewMode; // Removed
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ project, onEditProject, onDeleteProject, currentTheme }) => {
  const glassEffectClass = currentTheme === 'glass' ? 'glass-effect' : '';

  return (
    <div 
      className={`p-4 rounded-lg shadow-lg flex justify-between items-center
                 bg-[var(--bg-card)] border border-[var(--border-color)] ${glassEffectClass}`}
      style={{ boxShadow: `0 4px 6px -1px var(--shadow-color-soft), 0 2px 4px -1px var(--shadow-color-medium)` }}
    >
      <div className="flex items-center">
        <span 
          className="w-6 h-6 rounded-full mr-3 border border-white/20 flex-shrink-0" 
          style={{ backgroundColor: project.color }}
          title={`Project color: ${project.color}`}
        ></span>
        <span className="text-lg font-semibold text-[var(--text-accent)]" title={project.name}>{project.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEditProject(project)}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-accent)] transition-colors"
          title="Edit Project"
        >
          <EditIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDeleteProject(project.id)}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--button-stop-bg)] transition-colors"
          title="Delete Project"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProjectListItem;
