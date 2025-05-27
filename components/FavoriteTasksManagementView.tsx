
import React, { useState, useMemo } from 'react';
import { FavoriteTasksManagementViewProps, Project, AbacusCode, FavoriteTaskTemplate } from '../types';
import FavoriteTaskTemplateListItem from './FavoriteTaskTemplateListItem';
import { BookmarkIcon, ChevronDownIcon } from '../constants'; // Added ChevronDownIcon

interface ProjectGroup {
  project: Project | { id: 'unassigned'; name: 'Unassigned'; color: 'var(--neutral-project-color)' }; // Handle unassigned
  templates: FavoriteTaskTemplate[];
}

const FavoriteTasksManagementView: React.FC<FavoriteTasksManagementViewProps> = ({
  favoriteTaskTemplates,
  onUseFavorite,
  onDeleteFavorite,
  projects,
  abacusCodes,
  currentTheme,
}) => {
  const glassEffectClass = currentTheme === 'glass' ? 'glass-effect' : '';
  const [searchTerm, setSearchTerm] = useState('');
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  const toggleAccordion = (projectId: string) => {
    setOpenAccordions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const filteredAndGroupedTemplates = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    const filtered = favoriteTaskTemplates.filter(template => {
      const project = projects.find(p => p.id === template.projectId);
      const abacusCode = template.abacusCodeId ? abacusCodes.find(ac => ac.id === template.abacusCodeId) : undefined;

      return (
        template.name.toLowerCase().includes(lowerSearchTerm) ||
        (template.description && template.description.toLowerCase().includes(lowerSearchTerm)) ||
        (project && project.name.toLowerCase().includes(lowerSearchTerm)) ||
        (abacusCode && abacusCode.code.toLowerCase().includes(lowerSearchTerm))
      );
    });

    const grouped = new Map<string, FavoriteTaskTemplate[]>();
    
    // Pre-populate map with all projects to maintain project sort order even if empty after filter
    // Or, only include projects that *have* templates after filtering. Let's do the latter for cleaner UI.

    filtered.forEach(template => {
      const projectId = template.projectId || 'unassigned'; // Group by 'unassigned' if no project
      if (!grouped.has(projectId)) {
        grouped.set(projectId, []);
      }
      grouped.get(projectId)!.push(template);
    });

    // Sort templates within each group
    grouped.forEach(templates => {
      templates.sort((a, b) => a.name.localeCompare(b.name));
    });
    
    const projectGroups: ProjectGroup[] = Array.from(grouped.entries()).map(([projectId, templates]) => {
      const projectDetails = projects.find(p => p.id === projectId);
      return {
        project: projectDetails || { id: 'unassigned', name: 'Unassigned', color: 'var(--neutral-project-color)' },
        templates,
      };
    });

    // Sort project groups by project name
    projectGroups.sort((a, b) => a.project.name.localeCompare(b.project.name));
    
    return projectGroups;

  }, [favoriteTaskTemplates, searchTerm, projects, abacusCodes]);

  return (
    <div
      className={`p-4 sm:p-2 rounded-lg shadow-xl max-h-[85vh] flex flex-col bg-transparent border-none ${glassEffectClass}`}
    >
      {favoriteTaskTemplates.length === 0 ? (
        <div className="text-center text-[var(--text-secondary)] py-12">
          <BookmarkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" filled={false} />
          <p className="text-lg">No Favorite Templates Yet</p>
          <p className="text-sm mt-1">
            Save tasks as favorites from their actions menu.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 px-2">
            <input
              type="text"
              placeholder="Search favorites (name, project, abacus...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md shadow-sm text-[var(--text-main)] placeholder-[var(--text-placeholder)] focus:ring-1 focus:ring-[var(--border-input-focus)] focus:border-[var(--border-input-focus)] sm:text-sm"
            />
          </div>

          {filteredAndGroupedTemplates.length === 0 && searchTerm && (
            <p className="text-center text-[var(--text-secondary)] py-8">No favorite templates match your search.</p>
          )}

          <div className="flex-grow overflow-y-auto themed-scrollbar pr-1 space-y-2">
            {filteredAndGroupedTemplates.map(({ project, templates }) => (
              <div key={project.id} className={`rounded-md border border-[var(--border-color)] overflow-hidden ${glassEffectClass} bg-[var(--bg-modal)]`}>
                <button
                  onClick={() => toggleAccordion(project.id)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-[var(--bg-button-hover)] transition-colors"
                  aria-expanded={openAccordions.has(project.id)}
                  aria-controls={`accordion-content-${project.id}`}
                >
                  <div className="flex items-center">
                    <span 
                      className="w-4 h-4 rounded-full mr-2.5 flex-shrink-0 border border-white/10" 
                      style={{ backgroundColor: project.color }}
                      title={`Project: ${project.name}`}
                    ></span>
                    <span className="font-semibold text-[var(--text-main)]">{project.name}</span>
                    <span className="ml-2 text-xs text-[var(--text-secondary)]">({templates.length})</span>
                  </div>
                  <ChevronDownIcon className={`w-5 h-5 text-[var(--text-secondary)] transition-transform duration-200 ${openAccordions.has(project.id) ? 'transform rotate-180' : ''}`} />
                </button>
                {openAccordions.has(project.id) && (
                  <div id={`accordion-content-${project.id}`} className="p-2 space-y-2 sm:space-y-3 border-t border-[var(--border-color)]">
                    {templates.map(template => (
                      <FavoriteTaskTemplateListItem
                        key={template.id}
                        template={template}
                        onUse={onUseFavorite}
                        onDelete={onDeleteFavorite}
                        projects={projects}
                        abacusCodes={abacusCodes}
                        currentTheme={currentTheme}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FavoriteTasksManagementView;
