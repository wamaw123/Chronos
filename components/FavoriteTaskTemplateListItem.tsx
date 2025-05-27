
import React from 'react';
import { FavoriteTaskTemplateListItemProps, Project, AbacusCode } from '../types';
import { CheckCircleIcon, TrashIcon, BookmarkIcon } from '../constants'; // Assuming CheckCircleIcon is for "Use"

const FavoriteTaskTemplateListItem: React.FC<FavoriteTaskTemplateListItemProps> = ({
  template,
  onUse,
  onDelete,
  projects,
  abacusCodes,
  currentTheme,
}) => {
  const glassEffectClass = currentTheme === 'glass' ? 'glass-effect' : '';
  const project = projects.find(p => p.id === template.projectId);
  const abacusCode = template.abacusCodeId ? abacusCodes.find(ac => ac.id === template.abacusCodeId) : undefined;

  return (
    <div
      className={`p-3 sm:p-4 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-start
                 bg-[var(--bg-card)] border border-[var(--border-color)] ${glassEffectClass}`}
      style={{ boxShadow: `0 4px 6px -1px var(--shadow-color-soft), 0 2px 4px -1px var(--shadow-color-medium)` }}
    >
      <div className="flex-grow min-w-0">
        <div className="flex items-center mb-1">
            <BookmarkIcon className="w-4 h-4 text-[var(--text-accent)] mr-2 flex-shrink-0" filled />
            <h3 className="text-md font-semibold text-[var(--text-accent)] truncate" title={template.name}>
                {template.name}
            </h3>
        </div>

        {project && (
          <p className="text-xs mt-0.5 flex items-center" title={`Project: ${project.name}`}>
            <span 
                className="w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0" 
                style={{ backgroundColor: project.color }}
            ></span>
            <span style={{color: project.color}}>{project.name}</span>
          </p>
        )}
        {abacusCode && (
          <p className="text-xs mt-0.5 text-[var(--text-secondary)]" title={`Abacus: ${abacusCode.code}`}>
            Abacus: {abacusCode.code}
          </p>
        )}
        {template.description && (
          <p className="text-xs mt-1 text-[var(--text-secondary)] italic truncate" title={template.description}>
            {template.description}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0 self-start sm:self-center mt-3 sm:mt-0 pl-0 sm:pl-4">
        <button
          onClick={() => onUse(template)}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--button-start-bg)] transition-colors rounded-full"
          title="Use this favorite template"
        >
          <CheckCircleIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(template.id)}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--button-stop-bg)] transition-colors rounded-full"
          title="Delete this favorite template"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FavoriteTaskTemplateListItem;
