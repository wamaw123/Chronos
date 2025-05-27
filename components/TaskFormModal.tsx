import React, { useState, useEffect, useRef } from 'react';
import { Task, Project, AbacusCode, TaskFormModalProps } from '../types';
import { generateId } from '../utils/idUtils';
import Modal from './Modal';
// ProjectFormModal and AbacusCodeFormModal are no longer imported here
import { PlusIcon, CalendarIcon } from '../constants';
import { formatDate } from '../utils/dateUtils';

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen, onClose, onSaveTask, existingTask, projects, abacusCodes, 
  onSaveProject, onSaveAbacusCode,
  currentTheme, 
  
  taskFormName, setTaskFormName,
  taskFormDescription, setTaskFormDescription,
  taskFormDate, setTaskFormDate,
  
  taskFormProjectId, setTaskFormProjectId,
  taskFormProjectSearch, setTaskFormProjectSearch,
  pendingProjectSelection, clearPendingProjectSelection,

  taskFormAbacusCodeId, setTaskFormAbacusCodeId,
  taskFormAbacusCodeSearch, setTaskFormAbacusCodeSearch,
  pendingAbacusCodeSelection, clearPendingAbacusCodeSelection
}) => {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  
  const [filteredAbacusCodes, setFilteredAbacusCodes] = useState<AbacusCode[]>([]);
  const [showAbacusCodeDropdown, setShowAbacusCodeDropdown] = useState(false);

  const projectInputRef = useRef<HTMLInputElement>(null);
  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const abacusInputRef = useRef<HTMLInputElement>(null);
  const abacusDropdownRef = useRef<HTMLDivElement>(null);

  // State for inline project creation
  const [showInlineProjectForm, setShowInlineProjectForm] = useState(false);
  const [inlineProjectName, setInlineProjectName] = useState('');
  const [inlineProjectColor, setInlineProjectColor] = useState('#6366f1'); // Default color

  // State for inline Abacus code creation
  const [showInlineAbacusForm, setShowInlineAbacusForm] = useState(false);
  const [inlineAbacusCodeValue, setInlineAbacusCodeValue] = useState('');
  // inlineAbacusDescription removed


  useEffect(() => {
    if (!isOpen) { // Reset inline forms when main modal closes
        setShowInlineProjectForm(false);
        setInlineProjectName('');
        setInlineProjectColor('#6366f1');
        setShowInlineAbacusForm(false);
        setInlineAbacusCodeValue('');
        // inlineAbacusDescription reset removed
    }
  }, [isOpen]);


  // Effect for pending project selection
  useEffect(() => {
    if (pendingProjectSelection) {
      setTaskFormProjectId(pendingProjectSelection.id);
      setTaskFormProjectSearch(pendingProjectSelection.name);
      clearPendingProjectSelection(); 
      setShowProjectDropdown(false); 
    }
  }, [pendingProjectSelection, clearPendingProjectSelection, setTaskFormProjectId, setTaskFormProjectSearch]);
  
  // Effect for filtering projects
  useEffect(() => {
    if (taskFormProjectSearch.trim() === '') {
      setFilteredProjects(projects.slice(0, 5)); 
    } else {
      setFilteredProjects(
        projects.filter(p => p.name.toLowerCase().includes(taskFormProjectSearch.toLowerCase()))
      );
    }
  }, [taskFormProjectSearch, projects, isOpen]);

  // Effect for pending Abacus code selection
  useEffect(() => {
    if (pendingAbacusCodeSelection) {
      setTaskFormAbacusCodeId(pendingAbacusCodeSelection.id);
      setTaskFormAbacusCodeSearch(pendingAbacusCodeSelection.code);
      clearPendingAbacusCodeSelection();
      setShowAbacusCodeDropdown(false);
    }
  }, [pendingAbacusCodeSelection, clearPendingAbacusCodeSelection, setTaskFormAbacusCodeId, setTaskFormAbacusCodeSearch]);

  // Effect for filtering Abacus codes
  useEffect(() => {
    if (taskFormAbacusCodeSearch.trim() === '') {
      setFilteredAbacusCodes(abacusCodes.slice(0,5));
    } else {
      setFilteredAbacusCodes(
        abacusCodes.filter(ac => ac.code.toLowerCase().includes(taskFormAbacusCodeSearch.toLowerCase()))
      );
    }
  }, [taskFormAbacusCodeSearch, abacusCodes, isOpen]);


  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node) &&
          projectInputRef.current && !projectInputRef.current.contains(event.target as Node)) {
        setShowProjectDropdown(false);
      }
      if (abacusDropdownRef.current && !abacusDropdownRef.current.contains(event.target as Node) &&
          abacusInputRef.current && !abacusInputRef.current.contains(event.target as Node)) {
        setShowAbacusCodeDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleProjectSelect = (project: Project) => {
    setTaskFormProjectId(project.id);
    setTaskFormProjectSearch(project.name);
    setShowProjectDropdown(false);
    setShowInlineProjectForm(false); // Hide inline form if a project is selected
  };

  const handleAbacusCodeSelect = (abacusCode: AbacusCode) => {
    setTaskFormAbacusCodeId(abacusCode.id);
    setTaskFormAbacusCodeSearch(abacusCode.code);
    setShowAbacusCodeDropdown(false);
    setShowInlineAbacusForm(false); // Hide inline form
  };

  const handleTriggerInlineProjectForm = () => {
    setShowInlineProjectForm(true);
    setInlineProjectName(taskFormProjectSearch.trim()); // Pre-fill with search term
    setInlineProjectColor('#6366f1'); // Reset color
    setShowProjectDropdown(false); // Hide search dropdown
    // Focus on the inline project name input after a short delay
    setTimeout(() => document.getElementById('inlineProjectName')?.focus(), 0);
  };

  const handleSaveInlineProject = () => {
    if (!inlineProjectName.trim()) {
      alert("Project name cannot be empty.");
      return;
    }
    onSaveProject({ id: generateId(), name: inlineProjectName.trim(), color: inlineProjectColor }, true);
    // App.tsx's onSaveProject will set pendingProjectSelection, which an effect here will pick up.
    setShowInlineProjectForm(false);
    setInlineProjectName(''); 
  };

  const handleCancelInlineProject = () => {
    setShowInlineProjectForm(false);
    setInlineProjectName('');
    setInlineProjectColor('#6366f1');
  };

  const handleTriggerInlineAbacusForm = () => {
    setShowInlineAbacusForm(true);
    setInlineAbacusCodeValue(taskFormAbacusCodeSearch.trim()); // Pre-fill
    // inlineAbacusDescription reset removed
    setShowAbacusCodeDropdown(false);
    setTimeout(() => document.getElementById('inlineAbacusCodeValue')?.focus(), 0);
  };

  const handleSaveInlineAbacusCode = () => {
    if (!inlineAbacusCodeValue.trim()) {
      alert("Abacus code cannot be empty.");
      return;
    }
    onSaveAbacusCode({ id: generateId(), code: inlineAbacusCodeValue.trim() }, true);
    setShowInlineAbacusForm(false);
    setInlineAbacusCodeValue('');
    // inlineAbacusDescription reset removed
  };

  const handleCancelInlineAbacusCode = () => {
    setShowInlineAbacusForm(false);
    setInlineAbacusCodeValue('');
    // inlineAbacusDescription reset removed
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskFormName.trim()) {
      alert("Task name cannot be empty."); 
      return;
    }
    if (!taskFormProjectId) {
      alert("Please select or create a project for this task.");
      return;
    }
    if (!taskFormDate) {
        alert("Please select a date for the task.");
        return;
    }
    
    const taskData: Task = {
      id: existingTask?.id || generateId(),
      name: taskFormName.trim(),
      description: taskFormDescription.trim() || undefined,
      createdAt: existingTask?.createdAt || Date.now(),
      date: taskFormDate, // Use date from form state
      projectId: taskFormProjectId,
      abacusCodeId: taskFormAbacusCodeId || undefined, 
      isCompleted: existingTask?.isCompleted || false, 
      isImportant: existingTask?.isImportant || false,
      order: existingTask?.order ?? 0, // Order will be recalculated in App.tsx based on the new date
    };
    onSaveTask(taskData);
  };

  const canCreateNewProject = taskFormProjectSearch.trim() !== '' && !projects.find(p => p.name.toLowerCase() === taskFormProjectSearch.trim().toLowerCase());
  const canCreateNewAbacusCode = taskFormAbacusCodeSearch.trim() !== '' && !abacusCodes.find(ac => ac.code.toLowerCase() === taskFormAbacusCodeSearch.trim().toLowerCase());

  const displaySelectedDate = taskFormDate 
    ? formatDate(new Date(taskFormDate + 'T00:00:00'), { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) 
    : 'No date selected';

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={existingTask ? 'Edit Task' : 'Add New Task'} 
        currentTheme={currentTheme}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="taskName" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Task Name</label>
            <input
              type="text" id="taskName" value={taskFormName} onChange={(e) => setTaskFormName(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md shadow-sm text-[var(--text-main)] placeholder-[var(--text-placeholder)] focus:ring-1 focus:ring-[var(--border-input-focus)] focus:border-[var(--border-input-focus)] sm:text-sm"
              placeholder="Enter task name" required
            />
          </div>
          
          {/* Task Date Picker */}
          <div>
            <label htmlFor="taskDate" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Task Date</label>
            <div className="flex items-center bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md shadow-sm">
                <span className="pl-3">
                    <CalendarIcon className="w-5 h-5 text-[var(--text-secondary)]"/>
                </span>
                <input
                    type="date" id="taskDate" value={taskFormDate} onChange={(e) => setTaskFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent text-[var(--text-main)] focus:ring-0 focus:border-transparent border-none sm:text-sm"
                    required
                />
            </div>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Selected: <span className="font-medium text-[var(--text-main)]">{displaySelectedDate}</span>
            </p>
          </div>


          {/* Project Selection / Inline Creation */}
          <div className="relative">
            <label htmlFor="projectSearch" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Project *</label>
            {!showInlineProjectForm && (
              <>
                <div className="flex items-center">
                  <input
                    ref={projectInputRef} type="text" id="projectSearch" value={taskFormProjectSearch}
                    onChange={(e) => { setTaskFormProjectSearch(e.target.value); setShowProjectDropdown(true); setTaskFormProjectId('');}}
                    onFocus={() => setShowProjectDropdown(true)}
                    className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-l-md shadow-sm text-[var(--text-main)] placeholder-[var(--text-placeholder)] focus:ring-1 focus:ring-[var(--border-input-focus)] focus:border-[var(--border-input-focus)] sm:text-sm"
                    placeholder="Search or create project" autoComplete="off"
                  />
                  <button type="button" onClick={handleTriggerInlineProjectForm}
                    className="p-2 bg-[var(--accent-secondary)] text-[var(--text-on-accent)] rounded-r-md hover:bg-[var(--accent-primary-hover)] transition-colors" title="Create new project">
                    <PlusIcon className="w-5 h-5"/>
                  </button>
                </div>
                {showProjectDropdown && (
                  <div ref={projectDropdownRef} className="absolute z-20 w-full mt-1 bg-[var(--bg-dropdown)] border border-[var(--border-color)] rounded-md shadow-lg max-h-60 overflow-y-auto themed-scrollbar">
                    {filteredProjects.map(p => (
                      <div key={p.id} onClick={() => handleProjectSelect(p)}
                        className="px-3 py-2 hover:bg-[var(--bg-button-hover)] cursor-pointer flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: p.color }}></span>
                        <span className="text-[var(--text-main)]">{p.name}</span>
                      </div>
                    ))}
                    {canCreateNewProject && (
                        <div onClick={handleTriggerInlineProjectForm} className="px-3 py-2 hover:bg-[var(--bg-button-hover)] cursor-pointer flex items-center text-[var(--text-accent)]">
                            <PlusIcon className="w-4 h-4 mr-2"/> Create project "{taskFormProjectSearch.trim()}"
                        </div>
                    )}
                    {filteredProjects.length === 0 && taskFormProjectSearch.trim() !== '' && !canCreateNewProject && (
                        <div className="px-3 py-2 text-[var(--text-secondary)]">No projects found. Click '+' or type new.</div>
                    )}
                    {projects.length === 0 && taskFormProjectSearch.trim() === '' && (
                        <div className="px-3 py-2 text-[var(--text-secondary)]">No projects yet. Click '+' to create one.</div>
                    )}
                  </div>
                )}
                {taskFormProjectId && projects.find(p=>p.id === taskFormProjectId) && (
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                        Selected: <span className="font-medium" style={{color: projects.find(p=>p.id === taskFormProjectId)?.color || 'var(--text-main)'}}>{projects.find(p=>p.id === taskFormProjectId)?.name}</span>
                    </p>
                )}
              </>
            )}
            {/* Inline Project Form */}
            {showInlineProjectForm && (
              <div className="mt-2 p-3 border border-[var(--border-color)] rounded-md bg-[var(--bg-input)] space-y-3">
                <p className="text-sm font-medium text-[var(--text-accent)]">Create New Project</p>
                <div>
                  <label htmlFor="inlineProjectName" className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Project Name</label>
                  <input type="text" id="inlineProjectName" value={inlineProjectName} onChange={(e) => setInlineProjectName(e.target.value)}
                    className="w-full px-2 py-1.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md text-[var(--text-main)] sm:text-sm" required />
                </div>
                <div>
                  <label htmlFor="inlineProjectColor" className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Project Color</label>
                  <div className="flex items-center space-x-2">
                    <input type="color" id="inlineProjectColor" value={inlineProjectColor} onChange={(e) => setInlineProjectColor(e.target.value)}
                      className="w-10 h-8 p-0 border-none rounded-md cursor-pointer bg-[var(--bg-input)]"/>
                    <input type="text" value={inlineProjectColor} onChange={(e) => setInlineProjectColor(e.target.value)}
                      className="w-full px-2 py-1.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md text-[var(--text-main)] sm:text-sm" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={handleCancelInlineProject} className="px-3 py-1 text-xs text-[var(--text-main)] bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] rounded">Cancel</button>
                  <button type="button" onClick={handleSaveInlineProject} className="px-3 py-1 text-xs text-[var(--text-on-accent)] bg-[var(--accent-secondary)] hover:bg-[var(--accent-primary-hover)] rounded">Save Project</button>
                </div>
              </div>
            )}
          </div>

          {/* Abacus Code Selection / Inline Creation */}
          <div className="relative">
            <label htmlFor="abacusCodeSearch" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Abacus Code (Optional)</label>
             {!showInlineAbacusForm && (
                <>
                    <div className="flex items-center">
                        <input
                            ref={abacusInputRef} type="text" id="abacusCodeSearch" value={taskFormAbacusCodeSearch}
                            onChange={(e) => { setTaskFormAbacusCodeSearch(e.target.value); setShowAbacusCodeDropdown(true); setTaskFormAbacusCodeId(''); }}
                            onFocus={() => setShowAbacusCodeDropdown(true)}
                            className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-l-md shadow-sm text-[var(--text-main)] placeholder-[var(--text-placeholder)] focus:ring-1 focus:ring-[var(--border-input-focus)] focus:border-[var(--border-input-focus)] sm:text-sm"
                            placeholder="Search or create Abacus code" autoComplete="off"
                        />
                        <button type="button" onClick={handleTriggerInlineAbacusForm}
                            className="p-2 bg-[var(--accent-secondary)] text-[var(--text-on-accent)] rounded-r-md hover:bg-[var(--accent-primary-hover)] transition-colors" title="Create new Abacus code">
                            <PlusIcon className="w-5 h-5"/>
                        </button>
                    </div>
                    {showAbacusCodeDropdown && (
                        <div ref={abacusDropdownRef} className="absolute z-20 w-full mt-1 bg-[var(--bg-dropdown)] border border-[var(--border-color)] rounded-md shadow-lg max-h-60 overflow-y-auto themed-scrollbar">
                            {filteredAbacusCodes.map(ac => (
                                <div key={ac.id} onClick={() => handleAbacusCodeSelect(ac)}
                                    className="px-3 py-2 hover:bg-[var(--bg-button-hover)] cursor-pointer text-[var(--text-main)]">
                                    {ac.code}
                                </div>
                            ))}
                            {canCreateNewAbacusCode && (
                                <div onClick={handleTriggerInlineAbacusForm} className="px-3 py-2 hover:bg-[var(--bg-button-hover)] cursor-pointer flex items-center text-[var(--text-accent)]">
                                    <PlusIcon className="w-4 h-4 mr-2"/> Create Abacus code "{taskFormAbacusCodeSearch.trim()}"
                                </div>
                            )}
                            {filteredAbacusCodes.length === 0 && taskFormAbacusCodeSearch.trim() !== '' && !canCreateNewAbacusCode && (
                                <div className="px-3 py-2 text-[var(--text-secondary)]">No Abacus codes found. Click '+' or type new.</div>
                            )}
                            {abacusCodes.length === 0 && taskFormAbacusCodeSearch.trim() === '' && (
                                <div className="px-3 py-2 text-[var(--text-secondary)]">No Abacus codes yet. Click '+' to create one.</div>
                            )}
                        </div>
                    )}
                    {taskFormAbacusCodeId && abacusCodes.find(ac => ac.id === taskFormAbacusCodeId) && (
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                            Selected: <span className="font-medium text-[var(--text-main)]">{abacusCodes.find(ac=>ac.id === taskFormAbacusCodeId)?.code}</span>
                        </p>
                    )}
                </>
             )}
             {/* Inline Abacus Code Form */}
            {showInlineAbacusForm && (
              <div className="mt-2 p-3 border border-[var(--border-color)] rounded-md bg-[var(--bg-input)] space-y-3">
                <p className="text-sm font-medium text-[var(--text-accent)]">Create New Abacus Code</p>
                <div>
                  <label htmlFor="inlineAbacusCodeValue" className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Abacus Code</label>
                  <input type="text" id="inlineAbacusCodeValue" value={inlineAbacusCodeValue} onChange={(e) => setInlineAbacusCodeValue(e.target.value)}
                    className="w-full px-2 py-1.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md text-[var(--text-main)] sm:text-sm" required />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={handleCancelInlineAbacusCode} className="px-3 py-1 text-xs text-[var(--text-main)] bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] rounded">Cancel</button>
                  <button type="button" onClick={handleSaveInlineAbacusCode} className="px-3 py-1 text-xs text-[var(--text-on-accent)] bg-[var(--accent-secondary)] hover:bg-[var(--accent-primary-hover)] rounded">Save Abacus Code</button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="taskDescription" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description (Optional)</label>
            <textarea
              id="taskDescription" value={taskFormDescription} onChange={(e) => setTaskFormDescription(e.target.value)} rows={3}
              className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md shadow-sm text-[var(--text-main)] placeholder-[var(--text-placeholder)] focus:ring-1 focus:ring-[var(--border-input-focus)] focus:border-[var(--border-input-focus)] sm:text-sm themed-scrollbar"
              placeholder="Enter task description"
            />
          </div>
          {/* Removed paragraph displaying existingTask.date as it's now handled by the input field */}
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[var(--text-main)] bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] rounded-md transition-colors border border-[var(--border-color)]">
              Cancel
            </button>
            <button type="submit"
              className="px-4 py-2 text-sm font-medium text-[var(--text-on-accent)] bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] rounded-md transition-colors border border-[var(--accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!taskFormName.trim() || !taskFormProjectId || showInlineProjectForm || showInlineAbacusForm || !taskFormDate} // Disable submit if inline form is open or date not set
            >
              {existingTask ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Nested modals removed from here. They are handled via main App.tsx for Project/Abacus management views. */}
    </>
  );
};

export default TaskFormModal;