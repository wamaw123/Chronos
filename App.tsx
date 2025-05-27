








import React, { useState, useEffect, useCallback } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Task, TimeEntry, ActiveTimer, Theme, ViewMode, Project, AbacusCode, DatePickerModalState, ConfirmationModalState, HeaderProps, PrintableWeeklyReportProps, ProjectTimeSummaryForReport, AbacusCodeTimeSummaryForReport, ToneColor, FavoriteTaskTemplate, SubTask } from './types';
import { generateId } from './utils/idUtils';
import { addDays, getLocalISODateString, adjustTimeEntryDate, formatDate, formatDuration, getStartOfWeek, getDaysInWeek } from './utils/dateUtils';
import useLocalStorage from './hooks/useLocalStorage';
import HeaderComponent from './components/Header'; // Renamed to avoid conflict
import DateNavigationToolbar from './components/DateNavigationToolbar';
import TaskList from './components/TaskList';
import WeekView from './components/WeekView';
import TaskFormModal from './components/TaskFormModal';
import DatePickerModal from './components/DatePickerModal';
import ProjectFormModal from './components/ProjectFormModal';
import ProjectManagementView from './components/ProjectManagementView';
import AbacusCodeFormModal from './components/AbacusCodeFormModal';
import AbacusCodeManagementView from './components/AbacusCodeManagementView';
import ManualTimeAdjustmentModal from './components/ManualTimeAdjustmentModal';
import ConfirmationModal from './components/ConfirmationModal';
import Modal from './components/Modal'; // Generic Modal for management views
import ThemeSwitcher from './components/ThemeSwitcher'; 
import ToneSwitcher from './components/ToneSwitcher'; // Import ToneSwitcher
import TaskDetailModal from './components/TaskDetailModal'; 
import PrintableReport from './components/PrintableReport'; 
import FavoriteTasksManagementView from './components/FavoriteTasksManagementView'; // New
import { APP_TITLE, FolderIcon, CalculatorIcon, CogIcon, PlusIcon as ReportIcon, CalendarIcon, BookmarkIcon } from './constants'; 


const App: React.FC = () => {
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const [abacusCodes, setAbacusCodes] = useLocalStorage<AbacusCode[]>('abacusCodes', []);
  const [favoriteTaskTemplates, setFavoriteTaskTemplates] = useLocalStorage<FavoriteTaskTemplate[]>('favoriteTaskTemplates', []); // New
  
  const initializeTasks = (storedTasks: Task[]): Task[] => {
    const tasksByDate: { [date: string]: Task[] } = {};
    
    storedTasks.forEach(task => {
      task.subTasks = (task.subTasks || []).map((st, index) => ({
        ...st, 
        order: st.order ?? index,
        timeLogged: st.timeLogged || 0, // Initialize timeLogged
      })) || [];
      if (!tasksByDate[task.date]) {
        tasksByDate[task.date] = [];
      }
      tasksByDate[task.date].push(task);
    });

    let updatedTasks: Task[] = [];
    Object.keys(tasksByDate).forEach(date => {
      const dailyTasks = tasksByDate[date]
        .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || a.createdAt - b.createdAt)
        .map((task, index) => ({
          ...task,
          order: task.order ?? index, 
        }));
      updatedTasks = updatedTasks.concat(dailyTasks);
    });
    return updatedTasks;
  };
  
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', [], initializeTasks);
  const [timeEntries, setTimeEntries] = useLocalStorage<TimeEntry[]>('timeEntries', []);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  
  const [currentSelectedDate, setCurrentSelectedDate] = useState<Date>(() => new Date());
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('viewMode', 'dailyTasks'); 
  const [theme, setTheme] = useLocalStorage<Theme>('app-theme', 'glass');
  const [currentTone, setCurrentTone] = useLocalStorage<ToneColor>('app-tone', 'purple');


  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [taskFormName, setTaskFormName] = useState('');
  const [taskFormDescription, setTaskFormDescription] = useState('');
  const [taskFormDate, setTaskFormDate] = useState<string>(getLocalISODateString(currentSelectedDate));
  const [taskFormProjectId, setTaskFormProjectId] = useState<string>('');
  const [taskFormProjectSearch, setTaskFormProjectSearch] = useState<string>('');
  const [taskFormAbacusCodeId, setTaskFormAbacusCodeId] = useState<string>('');
  const [taskFormAbacusCodeSearch, setTaskFormAbacusCodeSearch] = useState<string>('');

  const [isProjectsManagerOpen, setIsProjectsManagerOpen] = useState(false);
  const [isAbacusCodesManagerOpen, setIsAbacusCodesManagerOpen] = useState(false);
  const [isFavoritesManagerOpen, setIsFavoritesManagerOpen] = useState(false); // New

  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false); 
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [pendingProjectSelectionForTaskForm, setPendingProjectSelectionForTaskForm] = useState<Project | null>(null);

  const [isAbacusCodeFormOpen, setIsAbacusCodeFormOpen] = useState(false); 
  const [editingAbacusCode, setEditingAbacusCode] = useState<AbacusCode | null>(null);
  const [pendingAbacusCodeSelectionForTaskForm, setPendingAbacusCodeSelectionForTaskForm] = useState<AbacusCode | null>(null);

  const [datePickerModalState, setDatePickerModalState] = useState<DatePickerModalState>({ isOpen: false, mode: null });

  const [isManualTimeModalOpen, setIsManualTimeModalOpen] = useState(false);
  const [taskForManualTimeAdjustment, setTaskForManualTimeAdjustment] = useState<Task | null>(null);

  const [confirmationModalState, setConfirmationModalState] = useState<ConfirmationModalState>({ isOpen: false, title: '', message: '', onConfirm: null });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); 
  const [deletingTaskIds, setDeletingTaskIds] = useState<string[]>([]); 

  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [taskForDetailView, setTaskForDetailView] = useState<Task | null>(null);


  useEffect(() => {
    // Apply theme class
    const themeClasses = ['theme-glass', 'theme-dark', 'theme-light'];
    document.documentElement.classList.remove(...themeClasses);
    document.documentElement.classList.add(`theme-${theme}`);

    // Apply tone class
    const toneClasses = ['tone-purple', 'tone-blue', 'tone-teal', 'tone-pink'];
    document.documentElement.classList.remove(...toneClasses);
    document.documentElement.classList.add(`tone-${currentTone}`);
    
    document.title = `${APP_TITLE} - ${theme.charAt(0).toUpperCase() + theme.slice(1)} / ${currentTone.charAt(0).toUpperCase() + currentTone.slice(1)}`;
  }, [theme, currentTone]);

  useEffect(() => {
    let intervalIdToClear: number | undefined;
    if (activeTimer?.intervalId) {
      intervalIdToClear = activeTimer.intervalId;
    }
    return () => {
      if (intervalIdToClear) {
        clearInterval(intervalIdToClear);
      }
    };
  }, [activeTimer]);

  const openConfirmationModal = (title: string, message: string, onConfirmCallback: () => void) => {
    setConfirmationModalState({ isOpen: true, title, message, onConfirm: onConfirmCallback });
  };
  const closeConfirmationModal = () => {
    setConfirmationModalState({ isOpen: false, title: '', message: '', onConfirm: null });
  };

  const handleOpenProjectsManager = () => setIsProjectsManagerOpen(true);
  const handleCloseProjectsManager = () => {
    setIsProjectsManagerOpen(false);
    setIsProjectFormOpen(false); 
    setEditingProject(null);
  }
  const handleOpenAbacusCodesManager = () => setIsAbacusCodesManagerOpen(true);
  const handleCloseAbacusCodesManager = () => {
    setIsAbacusCodesManagerOpen(false);
    setIsAbacusCodeFormOpen(false); 
    setEditingAbacusCode(null);
  }
  const handleOpenFavoritesManager = () => setIsFavoritesManagerOpen(true); // New
  const handleCloseFavoritesManager = () => setIsFavoritesManagerOpen(false); // New

  const handleOpenSettingsModal = () => setIsSettingsModalOpen(true);
  const handleCloseSettingsModal = () => setIsSettingsModalOpen(false);


  const handleOpenProjectFormToEdit = (project: Project) => {
    setEditingProject(project);
    setIsProjectFormOpen(true); 
  };
  const handleCloseProjectForm = () => {
    setIsProjectFormOpen(false);
    setEditingProject(null);
  };

  const handleSaveProject = (projectData: Project, isNew: boolean) => {
    setProjects(prevProjects => {
      const existing = prevProjects.find(p => p.id === projectData.id);
      if (existing) { 
        return prevProjects.map(p => p.id === projectData.id ? projectData : p);
      } 
      return [...prevProjects, projectData];
    });
    if (isNew && isTaskModalOpen) { 
        setPendingProjectSelectionForTaskForm(projectData);
    }
  };

  const handleSaveNewProjectFromManagementView = (name: string, color: string) => {
    const newProject: Project = {
      id: generateId(),
      name: name,
      color: color,
    };
    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  const handleDeleteProject = (projectId: string) => {
    const tasksWithProject = tasks.filter(task => task.projectId === projectId);
    if (tasksWithProject.length > 0) {
      alert('Cannot delete project. It is associated with tasks. Reassign or delete tasks first.');
      return;
    }
    openConfirmationModal(
      'Delete Project',
      'Are you sure you want to delete this project? This action cannot be undone.',
      () => setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId))
    );
  };

  const handleOpenAbacusCodeFormToEdit = (code: AbacusCode) => { 
    setEditingAbacusCode(code);
    setIsAbacusCodeFormOpen(true);
  };
  const handleCloseAbacusCodeForm = () => {
    setIsAbacusCodeFormOpen(false);
    setEditingAbacusCode(null);
  };

  const handleSaveAbacusCode = (codeData: AbacusCode, isNew: boolean) => {
    const finalCodeData: AbacusCode = { id: codeData.id, code: codeData.code }; 
    setAbacusCodes(prevCodes => {
      const existing = prevCodes.find(c => c.id === finalCodeData.id);
      if (existing) {
        return prevCodes.map(c => c.id === finalCodeData.id ? finalCodeData : c);
      }
      return [...prevCodes, finalCodeData];
    });
    if (isNew && isTaskModalOpen) {
        setPendingAbacusCodeSelectionForTaskForm(finalCodeData);
    }
  };

  const handleSaveNewAbacusCodeFromManagementView = (codeValue: string) => {
    const newAbacusCode: AbacusCode = {
      id: generateId(),
      code: codeValue,
    };
    setAbacusCodes(prevCodes => [...prevCodes, newAbacusCode]);
  };


  const handleDeleteAbacusCode = (abacusCodeId: string) => {
    const tasksWithAbacusCode = tasks.filter(task => task.abacusCodeId === abacusCodeId);
    if (tasksWithAbacusCode.length > 0) {
      alert('Cannot delete Abacus code. It is associated with tasks. Remove from tasks first.');
      return;
    }
    openConfirmationModal(
      'Delete Abacus Code',
      'Are you sure you want to delete this Abacus code? This action cannot be undone.',
      () => setAbacusCodes(prevCodes => prevCodes.filter(c => c.id !== abacusCodeId))
    );
  };

  // Favorite Task Template Handlers
  const handleSaveTaskAsFavorite = (task: Task) => {
    const existingFavorite = favoriteTaskTemplates.find(
      ft => ft.name === task.name && ft.projectId === task.projectId && ft.abacusCodeId === task.abacusCodeId
    );
    if (existingFavorite) {
      alert("A similar favorite template already exists.");
      return;
    }

    const newFavoriteTemplate: FavoriteTaskTemplate = {
      id: generateId(),
      name: task.name,
      description: task.description,
      projectId: task.projectId,
      abacusCodeId: task.abacusCodeId,
    };
    setFavoriteTaskTemplates(prev => [...prev, newFavoriteTemplate]);
    alert(`Task "${task.name}" saved as a favorite template!`);
  };

  const handleDeleteFavoriteTemplate = (templateId: string) => {
    openConfirmationModal(
      'Delete Favorite Template',
      'Are you sure you want to delete this favorite template?',
      () => setFavoriteTaskTemplates(prev => prev.filter(ft => ft.id !== templateId))
    );
  };

  const handleUseFavoriteTemplate = (template: FavoriteTaskTemplate) => {
    setEditingTask(null); // Ensure it's a new task
    setTaskFormName(template.name);
    setTaskFormDescription(template.description || '');
    setTaskFormDate(getLocalISODateString(currentSelectedDate)); // Default to current selected date
    setTaskFormProjectId(template.projectId);
    const projectForTemplate = projects.find(p => p.id === template.projectId);
    setTaskFormProjectSearch(projectForTemplate?.name || '');
    setTaskFormAbacusCodeId(template.abacusCodeId || '');
    const abacusForTemplate = template.abacusCodeId ? abacusCodes.find(ac => ac.id === template.abacusCodeId) : null;
    setTaskFormAbacusCodeSearch(abacusForTemplate?.code || '');
    
    setIsFavoritesManagerOpen(false); // Close favorites manager
    setIsTaskModalOpen(true); // Open task form modal
  };


  const handleOpenTaskModal = (task?: Task) => {
    setPendingProjectSelectionForTaskForm(null); 
    setPendingAbacusCodeSelectionForTaskForm(null);

    if (task) { 
      setEditingTask(task);
      setTaskFormName(task.name);
      setTaskFormDescription(task.description || '');
      setTaskFormDate(task.date); // Set date from existing task
      setTaskFormProjectId(task.projectId);
      const projectForTask = projects.find(p => p.id === task.projectId);
      setTaskFormProjectSearch(projectForTask?.name || '');
      setTaskFormAbacusCodeId(task.abacusCodeId || '');
      const abacusForTask = task.abacusCodeId ? abacusCodes.find(ac => ac.id === task.abacusCodeId) : null;
      setTaskFormAbacusCodeSearch(abacusForTask?.code || '');
    } else { 
      setEditingTask(null);
      setTaskFormName('');
      setTaskFormDescription('');
      setTaskFormDate(getLocalISODateString(currentSelectedDate)); // Default to current selected date
      setTaskFormProjectId('');
      setTaskFormProjectSearch('');
      setTaskFormAbacusCodeId('');
      setTaskFormAbacusCodeSearch('');
    }
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setPendingProjectSelectionForTaskForm(null); 
    setPendingAbacusCodeSelectionForTaskForm(null);
    setTaskFormName('');
    setTaskFormDescription('');
    // setTaskFormDate(''); // Keep date state consistent with currentSelectedDate for next "Add"
    setTaskFormProjectId('');
    setTaskFormProjectSearch('');
    setTaskFormAbacusCodeId('');
    setTaskFormAbacusCodeSearch('');
  };

  const handleSaveTask = (taskDataFromModal: Task) => { 
    if (!taskDataFromModal.projectId) { 
      alert("A project must be selected for the task.");
      return;
    }
    if (!taskDataFromModal.name.trim()) {
      alert("Task name cannot be empty.");
      return;
    }
    
    setTasks(prevTasks => {
      const tasksForDay = prevTasks.filter(t => t.date === taskDataFromModal.date); // Use date from modal data
      const newOrder = taskDataFromModal.id && editingTask ? taskDataFromModal.order : tasksForDay.length; // Preserve order if editing, else new

      const finalTaskData: Task = {
          ...taskDataFromModal,
          description: taskDataFromModal.description || '',
          abacusCodeId: taskDataFromModal.abacusCodeId || undefined, 
          isCompleted: editingTask ? taskDataFromModal.isCompleted : false, 
          isImportant: editingTask ? taskDataFromModal.isImportant : false, 
          order: newOrder,
          createdAt: editingTask?.createdAt || Date.now(),
          id: editingTask?.id || generateId(),
          subTasks: (editingTask?.subTasks || []).map(st => ({...st, timeLogged: st.timeLogged || 0})), 
      };

      const existing = prevTasks.find(t => t.id === finalTaskData.id);
      if (existing) {
        // If date changed, reorder tasks on old and new dates
        if (existing.date !== finalTaskData.date) {
          const tasksOnOldDate = prevTasks
            .filter(t => t.date === existing.date && t.id !== existing.id)
            .sort((a,b) => a.order - b.order)
            .map((t, i) => ({ ...t, order: i }));

          const tasksOnNewDate = prevTasks
            .filter(t => t.date === finalTaskData.date && t.id !== finalTaskData.id) 
            .concat([{...finalTaskData, order: Infinity }]) 
            .sort((a,b) => a.order - b.order)
            .map((t, i) => ({ ...t, order: i }));
          
          const otherDateTasks = prevTasks.filter(t => t.date !== existing.date && t.date !== finalTaskData.date);
          return [...otherDateTasks, ...tasksOnOldDate, ...tasksOnNewDate];
        } else { // Date is the same, just update
          return prevTasks.map(t => t.id === finalTaskData.id ? finalTaskData : t);
        }
      }
      // New task
      return [...prevTasks, finalTaskData].sort((a,b) => (a.date.localeCompare(b.date) || a.order - b.order));
    });
    handleCloseTaskModal(); 
  };

  const handleUpdateTaskInline = (taskId: string, updates: Partial<Pick<Task, 'name' | 'description'>>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    openConfirmationModal(
      'Delete Task',
      'Are you sure you want to delete this task, all its sub-tasks, and all its time entries? This action cannot be undone.',
      () => {
        setDeletingTaskIds(prev => [...prev, taskId]); 

        setTimeout(() => {
          const taskToDelete = tasks.find(t => t.id === taskId);
          if (!taskToDelete) { 
             setDeletingTaskIds(prev => prev.filter(id => id !== taskId));
             return;
          }

          const remainingTasksOnDate = tasks
            .filter(t => t.date === taskToDelete.date && t.id !== taskId)
            .sort((a, b) => a.order - b.order)
            .map((task, index) => ({ ...task, order: index }));
          
          const otherDateTasks = tasks.filter(t => t.date !== taskToDelete.date);

          setTasks([...otherDateTasks, ...remainingTasksOnDate]);
          setTimeEntries(prevEntries => prevEntries.filter(entry => entry.taskId !== taskId));
          
          if (activeTimer?.taskId === taskId) { // Stop timer if it's for the deleted task (main or sub)
            if (activeTimer.intervalId) clearInterval(activeTimer.intervalId);
            setActiveTimer(null);
          }
          setDeletingTaskIds(prev => prev.filter(id => id !== taskId)); 
        }, 400); 
      }
    );
  };

  const handleToggleTaskComplete = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
    const task = tasks.find(t => t.id === taskId);
    // If a timer is active for this task (main or sub-task) and it's being marked complete
    if (activeTimer?.taskId === taskId && task && !task.isCompleted) { 
        handleStopTimer(taskId); // This will handle sub-task or main task correctly
    }
  };

  const handleToggleTaskImportant = (taskId: string) => {
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prevTasks;

      const taskToUpdate = prevTasks[taskIndex];
      const newImportance = !taskToUpdate.isImportant;

      if (newImportance) { 
        const tasksFromOtherDates = prevTasks.filter(t => t.date !== taskToUpdate.date);
        
        const tasksOnSameDateExcludingCurrent = prevTasks
          .filter(t => t.date === taskToUpdate.date && t.id !== taskId)
          .sort((a, b) => a.order - b.order);

        const updatedMarkedTask = {
          ...taskToUpdate,
          isImportant: true,
          order: 0, 
        };

        const reorderedOtherTasksOnSameDate = tasksOnSameDateExcludingCurrent.map((t, index) => ({
          ...t,
          order: index + 1,
        }));
        
        return [...tasksFromOtherDates, updatedMarkedTask, ...reorderedOtherTasksOnSameDate]
                .sort((a,b) => (a.date.localeCompare(b.date) || a.order - b.order));

      } else { 
        return prevTasks.map(t =>
          t.id === taskId ? { ...t, isImportant: false } : t
        ).sort((a,b) => (a.date.localeCompare(b.date) || a.order - b.order)); // re-sort to maintain order
      }
    });
  };

  const handleStartTimer = useCallback((taskId: string, subTaskId?: string) => {
    const taskToStart = tasks.find(t => t.id === taskId);
    if (!taskToStart) return;

    if (taskToStart.isCompleted) {
      alert("Cannot start timer for a completed task.");
      return;
    }
    if (subTaskId) {
        const subTask = taskToStart.subTasks?.find(st => st.id === subTaskId);
        if (subTask?.isCompleted) {
            alert("Cannot start timer for a completed sub-task.");
            return;
        }
    }

    if (activeTimer) {
      alert("Another timer is already active. Stop it before starting a new one.");
      return;
    }
    setActiveTimer({ taskId, subTaskId, startTime: Date.now() });
  }, [activeTimer, tasks]);


  const handleStopTimer = useCallback((taskIdToStop: string) => { // taskIdToStop is mainly for assertion
    if (!activeTimer || activeTimer.taskId !== taskIdToStop) return;
    
    const endTime = Date.now();
    const duration = endTime - activeTimer.startTime;

    if (activeTimer.subTaskId) { // It's a sub-task timer
        const subId = activeTimer.subTaskId;
        setTasks(prevTasks => prevTasks.map(task => {
            if (task.id === activeTimer.taskId) {
                return {
                    ...task,
                    subTasks: (task.subTasks || []).map(st => 
                        st.id === subId ? { ...st, timeLogged: (st.timeLogged || 0) + duration } : st
                    )
                };
            }
            return task;
        }));
    } else { // It's a main task timer
        setTimeEntries(prevEntries => [...prevEntries, {
            id: generateId(),
            taskId: activeTimer.taskId,
            startTime: activeTimer.startTime,
            endTime: endTime,
            duration: duration,
        }]);
    }
    setActiveTimer(null);
  }, [activeTimer, setTasks, setTimeEntries]);


  const handleStartSubTaskTimer = (taskId: string, subTaskId: string) => {
    handleStartTimer(taskId, subTaskId);
  };

  const handleStopSubTaskTimer = (taskId: string, subTaskId: string) => {
    // The actual subTaskId being stopped is determined by activeTimer state
    if (activeTimer && activeTimer.taskId === taskId && activeTimer.subTaskId === subTaskId) {
      handleStopTimer(taskId);
    }
  };


  const openDatePickerModal = (mode: 'copy' | 'move', task: Task) => {
    setDatePickerModalState({ 
        isOpen: true, mode, taskId: task.id, taskName: task.name,
        currentTheme: theme, viewMode: viewMode
    });
  };
  const closeDatePickerModal = () => setDatePickerModalState({ isOpen: false, mode: null });

  const handleDateSelectedForCopyMove = (targetDateString: string) => { 
    const { mode, taskId } = datePickerModalState;
    if (!mode || !taskId) return;
    const taskToProcess = tasks.find(t => t.id === taskId);
    if (!taskToProcess) return;

    if (mode === 'copy') {
      setTasks(prev => {
        const tasksForTargetDay = prev.filter(t => t.date === targetDateString);
        const copiedSubTasks = (taskToProcess.subTasks || []).map(st => ({
          ...st,
          id: generateId(), 
          timeLogged: 0, // Reset time logged for copied sub-tasks
          isCompleted: false, // Reset completion for copied sub-tasks
        }));
        return [...prev, {
          ...taskToProcess, 
          id: generateId(), 
          date: targetDateString, 
          createdAt: Date.now(), 
          isCompleted: false, 
          order: tasksForTargetDay.length, 
          subTasks: copiedSubTasks,
        }].sort((a,b) => (a.date.localeCompare(b.date) || a.order - b.order));
      });
    } else if (mode === 'move') {
      setTasks(prev => {
        const tasksOnOldDate = prev
          .filter(t => t.date === taskToProcess.date && t.id !== taskId)
          .sort((a,b) => a.order - b.order)
          .map((t, i) => ({ ...t, order: i }));
        
        const otherDateTasks = prev.filter(t => t.date !== taskToProcess.date);
        
        const tasksOnNewDate = prev
            .filter(t => t.date === targetDateString)
            .concat([{ ...taskToProcess, date: targetDateString, order: Infinity }]) 
            .sort((a,b) => a.order - b.order)
            .map((t, i) => ({ ...t, order: i }));

        const allOtherDateTasks = otherDateTasks.filter(t => t.date !== targetDateString);

        return [...allOtherDateTasks, ...tasksOnOldDate, ...tasksOnNewDate]
                .sort((a,b) => (a.date.localeCompare(b.date) || a.order - b.order));
      });

      setTimeEntries(prevEntries => 
        prevEntries.map(entry => {
          if (entry.taskId === taskId) {
            const { newStartTime, newEndTime } = adjustTimeEntryDate(entry.startTime, entry.endTime, entry.duration, targetDateString);
            return { ...entry, startTime: newStartTime, endTime: newEndTime };
          }
          return entry;
        })
      );
    }
    closeDatePickerModal();
  };

  const handleOpenManualTimeModal = (task: Task) => {
    setTaskForManualTimeAdjustment(task);
    setIsManualTimeModalOpen(true);
  };
  const handleCloseManualTimeModal = () => {
    setIsManualTimeModalOpen(false);
    setTaskForManualTimeAdjustment(null);
  };
  const handleApplyManualTimeAdjustment = (hours: number, minutes: number, mode: 'add' | 'subtract') => {
    if (!taskForManualTimeAdjustment) return;

    const adjustmentMillis = (hours * 3600 + minutes * 60) * 1000;
    const taskDate = taskForManualTimeAdjustment.date; 

    if (mode === 'add') {
      const [year, month, day] = taskDate.split('-').map(Number);
      const currentTime = new Date();
      const entryStartTime = new Date(year, month -1, day, currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds()).getTime();

      setTimeEntries(prev => [...prev, {
        id: generateId(),
        taskId: taskForManualTimeAdjustment.id,
        startTime: entryStartTime, 
        endTime: entryStartTime + adjustmentMillis,
        duration: adjustmentMillis,
        notes: `Manual time ${mode === 'add' ? 'addition' : 'subtraction'}`
      }]);
    } else { 
      let remainingToSubtract = adjustmentMillis;
      const taskEntriesOnDate = timeEntries
        .filter(entry => entry.taskId === taskForManualTimeAdjustment.id && getLocalISODateString(new Date(entry.startTime)) === taskDate)
        .sort((a, b) => b.startTime - a.startTime); 

      const totalLoggedOnDateByEntries = taskEntriesOnDate.reduce((sum, entry) => sum + entry.duration, 0);
      // Sub-tasks time is not adjusted via this modal, only direct main task entries
      if (remainingToSubtract > totalLoggedOnDateByEntries) {
        alert(`Cannot subtract ${formatDuration(remainingToSubtract)}. Only ${formatDuration(totalLoggedOnDateByEntries)} logged directly to this task on this date.`);
        return;
      }
      
      const updatedEntries: TimeEntry[] = [];
      const allOtherEntries = timeEntries.filter(entry => !(entry.taskId === taskForManualTimeAdjustment.id && getLocalISODateString(new Date(entry.startTime)) === taskDate));

      for (const entry of taskEntriesOnDate) {
        if (remainingToSubtract <= 0) {
          updatedEntries.push(entry);
          continue;
        }
        if (entry.duration >= remainingToSubtract) {
          updatedEntries.push({ ...entry, duration: entry.duration - remainingToSubtract, notes: (entry.notes || "") + " Adjusted." });
          remainingToSubtract = 0;
        } else {
          remainingToSubtract -= entry.duration;
        }
      }
      setTimeEntries([...allOtherEntries, ...updatedEntries.filter(e => e.duration > 0)]);
    }
  };

  const handleReorderTask = (draggedTaskId: string, dropOnItemId: string | null, taskDate: string) => {
    setTasks(prevTasks => {
      const tasksForDayOriginal = prevTasks.filter(task => task.date === taskDate).sort((a, b) => a.order - b.order);
      const otherTasks = prevTasks.filter(task => task.date !== taskDate);
  
      const draggedTask = tasksForDayOriginal.find(task => task.id === draggedTaskId);
      if (!draggedTask) return prevTasks;
  
      let listWithoutDragged = tasksForDayOriginal.filter(task => task.id !== draggedTaskId);
      let insertionIndex = -1;
  
      if (dropOnItemId === null) { 
        insertionIndex = listWithoutDragged.length;
      } else {
        const dropOnItem = tasksForDayOriginal.find(task => task.id === dropOnItemId); 
        if (!dropOnItem) { 
          insertionIndex = listWithoutDragged.length;
        } else {
          const dropOnItemIndexInStrippedList = listWithoutDragged.findIndex(t => t.id === dropOnItemId);
          
          if (draggedTask.order < dropOnItem.order) {
            insertionIndex = dropOnItemIndexInStrippedList + 1; 
          } else { 
            insertionIndex = dropOnItemIndexInStrippedList; 
          }
        }
      }
      
      if (insertionIndex < 0) insertionIndex = 0;
      if (insertionIndex > listWithoutDragged.length) insertionIndex = listWithoutDragged.length;

      listWithoutDragged.splice(insertionIndex, 0, draggedTask);
      
      const finalTasksForDay = listWithoutDragged.map((task, index) => ({
        ...task,
        order: index,
      }));
      return [...otherTasks, ...finalTasksForDay].sort((a,b) => (a.date.localeCompare(b.date) || a.order - b.order));
    });
  };
  

  const handleNavigation = (days: number) => {
    setCurrentSelectedDate(prevDate => addDays(prevDate, days));
  };
  const handleGoToToday = () => setCurrentSelectedDate(new Date());

  // Calculate total time for selected day (main task entries + sub-task logged times)
  const calculateTotalTimeForDay = (date: Date) => {
    const localDateStr = getLocalISODateString(date);
    return tasks
        .filter(task => task.date === localDateStr)
        .reduce((totalDayTime, task) => {
            const mainTaskTime = timeEntries
                .filter(entry => entry.taskId === task.id && getLocalISODateString(new Date(entry.startTime)) === localDateStr)
                .reduce((sum, entry) => sum + entry.duration, 0);
            const subTasksTime = (task.subTasks || []).reduce((sum, subTask) => sum + (subTask.timeLogged || 0), 0);
            return totalDayTime + mainTaskTime + subTasksTime;
        }, 0);
  };
  const totalTimeForSelectedDay = calculateTotalTimeForDay(currentSelectedDate);


  const handleDaySelectFromWeekView = (date: Date) => {
    setCurrentSelectedDate(date);
    setViewMode('dailyTasks');
  };

  const handleOpenTaskDetailModal = (taskId: string) => {
    const taskToShow = tasks.find(t => t.id === taskId);
    if (taskToShow) {
      setTaskForDetailView(taskToShow);
      setIsTaskDetailModalOpen(true);
    }
  };
  const handleCloseTaskDetailModal = () => {
    setIsTaskDetailModalOpen(false);
    setTaskForDetailView(null);
  };

  // Sub-task Handlers
  const handleAddSubTask = (taskId: string, subTaskName: string) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        const newSubTask: SubTask = {
          id: generateId(),
          name: subTaskName,
          isCompleted: false,
          order: task.subTasks ? task.subTasks.length : 0,
          createdAt: Date.now(),
          timeLogged: 0,
        };
        return { ...task, subTasks: [...(task.subTasks || []), newSubTask] };
      }
      return task;
    }));
  };

  const handleToggleSubTaskComplete = (taskId: string, subTaskId: string) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        const updatedSubTasks = (task.subTasks || []).map(st => 
            st.id === subTaskId ? { ...st, isCompleted: !st.isCompleted } : st
          );
        // If sub-task is marked complete and its timer is running, stop it.
        const subTask = updatedSubTasks.find(st => st.id === subTaskId);
        if (activeTimer && activeTimer.taskId === taskId && activeTimer.subTaskId === subTaskId && subTask?.isCompleted) {
            handleStopTimer(taskId); // This will correctly update subTask's timeLogged
        }
        return { ...task, subTasks: updatedSubTasks };
      }
      return task;
    }));
  };

  const handleDeleteSubTask = (taskId: string, subTaskId: string) => {
    openConfirmationModal(
      'Delete Sub-task',
      'Are you sure you want to delete this sub-task? This action cannot be undone.',
      () => {
        setTasks(prevTasks => prevTasks.map(task => {
          if (task.id === taskId) {
            // If this sub-task's timer is active, stop it first.
            if (activeTimer && activeTimer.taskId === taskId && activeTimer.subTaskId === subTaskId) {
                if(activeTimer.intervalId) clearInterval(activeTimer.intervalId);
                setActiveTimer(null); // Just clear, no time logging for deleted.
            }
            const updatedSubTasks = (task.subTasks || []).filter(st => st.id !== subTaskId)
                                                      .map((st, index) => ({ ...st, order: index })); // Re-order
            return { ...task, subTasks: updatedSubTasks };
          }
          return task;
        }));
      }
    );
  };


  const handleGenerateWeeklyReport = () => {
    const weekStart = getStartOfWeek(currentSelectedDate, 1);
    const weekEnd = addDays(weekStart, 6);
    const weekDayStrings = getDaysInWeek(weekStart).map(day => getLocalISODateString(day));

    const tasksInWeek = tasks.filter(task => weekDayStrings.includes(task.date));
    
    let totalWeekDurationMs = 0;
    const projectTimeMap = new Map<string, number>();
    projects.forEach(p => projectTimeMap.set(p.id, 0));
    const abacusTimeMap = new Map<string, number>();
    abacusCodes.forEach(ac => abacusTimeMap.set(ac.id, 0));

    tasksInWeek.forEach(task => {
        // Add main task time entries
        const mainTaskTime = timeEntries
            .filter(entry => entry.taskId === task.id && weekDayStrings.includes(getLocalISODateString(new Date(entry.startTime))))
            .reduce((sum, entry) => sum + entry.duration, 0);
        totalWeekDurationMs += mainTaskTime;
        if (task.projectId && mainTaskTime > 0) {
            projectTimeMap.set(task.projectId, (projectTimeMap.get(task.projectId) || 0) + mainTaskTime);
        }
        if (task.abacusCodeId && mainTaskTime > 0) {
            abacusTimeMap.set(task.abacusCodeId, (abacusTimeMap.get(task.abacusCodeId) || 0) + mainTaskTime);
        }

        // Add sub-task logged times
        (task.subTasks || []).forEach(subTask => {
            totalWeekDurationMs += subTask.timeLogged;
            if (task.projectId && subTask.timeLogged > 0) {
                 projectTimeMap.set(task.projectId, (projectTimeMap.get(task.projectId) || 0) + subTask.timeLogged);
            }
            if (task.abacusCodeId && subTask.timeLogged > 0) {
                 abacusTimeMap.set(task.abacusCodeId, (abacusTimeMap.get(task.abacusCodeId) || 0) + subTask.timeLogged);
            }
        });
    });


    const projectSummaries: ProjectTimeSummaryForReport[] = Array.from(projectTimeMap.entries())
        .map(([projectId, duration]) => {
            const project = projects.find(p => p.id === projectId);
            return {
                projectName: project?.name || 'Unknown Project',
                projectColor: project?.color || '#888888',
                totalHoursFormatted: formatDuration(duration),
            };
        })
        .filter(p => p.totalHoursFormatted !== '0s')
        .sort((a,b) => b.totalHoursFormatted.localeCompare(a.totalHoursFormatted)); 

    const abacusCodeSummaries: AbacusCodeTimeSummaryForReport[] = Array.from(abacusTimeMap.entries())
        .map(([abacusCodeId, duration]) => {
            const abacus = abacusCodes.find(ac => ac.id === abacusCodeId);
            return {
                abacusCode: abacus?.code || 'Unknown Code',
                totalHoursFormatted: formatDuration(duration),
            };
        })
        .filter(ac => ac.totalHoursFormatted !== '0s')
        .sort((a,b) => b.totalHoursFormatted.localeCompare(a.totalHoursFormatted));

    const reportData: PrintableWeeklyReportProps = {
        reportTitle: 'Weekly Summary Report',
        weekPeriod: `${formatDate(weekStart, { month: 'long', day: 'numeric', year: 'numeric' })} - ${formatDate(weekEnd, { month: 'long', day: 'numeric', year: 'numeric' })}`,
        generatedDate: formatDate(new Date(), { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        totalWeekHoursFormatted: formatDuration(totalWeekDurationMs),
        projectSummaries,
        abacusCodeSummaries,
    };

    const reportHtmlString = ReactDOMServer.renderToStaticMarkup(<PrintableReport {...reportData} />);
    
    const reportStyles = `
        body { font-family: sans-serif; margin: 20px; color: #333; }
        h1 { color: #4A044E; border-bottom: 2px solid #4A044E; padding-bottom: 5px; }
        h2 { color: #1E3A8A; margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 3px;}
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f0f0f0; }
        hr { border: 0; border-top: 1px dashed #ccc; margin: 20px 0; }
        p { line-height: 1.6; }
        strong { color: #555; }
        @media print {
            body { margin: 0.5in; } 
            button { display: none; } 
        }
    `;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${reportData.reportTitle}</title>
                <style>${reportStyles}</style>
            </head>
            <body>
                <div class="printable-report">
                    ${reportHtmlString}
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() { window.close(); }, 500);
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    } else {
        alert("Failed to open print window. Please check your browser's pop-up blocker settings.");
    }
  };


  const renderMainContent = () => {
    switch (viewMode) {
      case 'dailyTasks':
        return (
          <section id="task-management">
            <div className="mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-accent)]">
                Tasks for {formatDate(currentSelectedDate, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
                {totalTimeForSelectedDay > 0 && (
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Total Logged Today: <span className="font-semibold text-[var(--text-main)]">{formatDuration(totalTimeForSelectedDay)}</span>
                    </p>
                )}
            </div>
            <TaskList
              tasks={tasks} projects={projects} abacusCodes={abacusCodes}
              currentSelectedDate={currentSelectedDate} activeTimer={activeTimer} timeEntries={timeEntries}
              onStartTimer={handleStartTimer} onStopTimer={handleStopTimer} // Pass generalized timers
              onEditTask={handleOpenTaskModal} onDeleteTask={handleDeleteTask}
              onCopyTask={(task) => openDatePickerModal('copy', task)}
              onMoveTask={(task) => openDatePickerModal('move', task)}
              onToggleComplete={handleToggleTaskComplete}
              onToggleImportant={handleToggleTaskImportant}
              onOpenManualTimeModal={handleOpenManualTimeModal}
              onUpdateTaskInline={handleUpdateTaskInline}
              onReorderTask={handleReorderTask}
              onSaveAsFavorite={handleSaveTaskAsFavorite}
              onAddSubTask={handleAddSubTask}
              onToggleSubTaskComplete={handleToggleSubTaskComplete}
              onDeleteSubTask={handleDeleteSubTask}
              onStartSubTaskTimer={handleStartSubTaskTimer} // Pass new sub-task timer handlers
              onStopSubTaskTimer={handleStopSubTaskTimer}   // Pass new sub-task timer handlers
              currentTheme={theme}
              deletingTaskIds={deletingTaskIds} 
            />
          </section>
        );
      case 'weeklyView':
        return (
          <section id="weekly-timesheet">
            <WeekView
              currentDateForWeek={currentSelectedDate} timeEntries={timeEntries}
              tasks={tasks} projects={projects} abacusCodes={abacusCodes}
              currentTheme={theme} viewMode={viewMode}
              onDaySelect={handleDaySelectFromWeekView} 
              onTaskSelectForDetail={handleOpenTaskDetailModal} 
            />
          </section>
        );
      default: return null; 
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)]">
      <div className="sticky top-0 z-40">
        <HeaderComponent
          onOpenProjectsManager={handleOpenProjectsManager}
          onOpenAbacusCodesManager={handleOpenAbacusCodesManager}
          onOpenFavoritesManager={handleOpenFavoritesManager} // New
          onOpenSettingsModal={handleOpenSettingsModal} 
          isProjectsManagerOpen={isProjectsManagerOpen}
          isAbacusCodesManagerOpen={isAbacusCodesManagerOpen}
          isFavoritesManagerOpen={isFavoritesManagerOpen} // New
        />
        <DateNavigationToolbar
            currentSelectedDate={currentSelectedDate}
            onPreviousDay={() => handleNavigation(viewMode === 'weeklyView' ? -7 : -1)}
            onNextDay={() => handleNavigation(viewMode === 'weeklyView' ? 7 : 1)}
            onGoToToday={handleGoToToday}
            viewMode={viewMode}
            setViewMode={setViewMode}
            currentTheme={theme}
            onAddTask={() => handleOpenTaskModal()} 
            isProjectsManagerOpen={isProjectsManagerOpen} 
            isAbacusCodesManagerOpen={isAbacusCodesManagerOpen}
            isFavoritesManagerOpen={isFavoritesManagerOpen} // New
        />
      </div>
      <main className="container mx-auto p-4 sm:p-6 flex-grow space-y-8">
        {renderMainContent()}
      </main>

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        onSaveTask={handleSaveTask} 
        existingTask={editingTask}
        projects={projects}
        abacusCodes={abacusCodes}
        onSaveProject={handleSaveProject} 
        onSaveAbacusCode={handleSaveAbacusCode}
        currentTheme={theme} 
        
        taskFormName={taskFormName} setTaskFormName={setTaskFormName}
        taskFormDescription={taskFormDescription} setTaskFormDescription={setTaskFormDescription}
        taskFormDate={taskFormDate} setTaskFormDate={setTaskFormDate}
        
        taskFormProjectId={taskFormProjectId} setTaskFormProjectId={setTaskFormProjectId}
        taskFormProjectSearch={taskFormProjectSearch} setTaskFormProjectSearch={setTaskFormProjectSearch}
        pendingProjectSelection={pendingProjectSelectionForTaskForm}
        clearPendingProjectSelection={() => setPendingProjectSelectionForTaskForm(null)}

        taskFormAbacusCodeId={taskFormAbacusCodeId} setTaskFormAbacusCodeId={setTaskFormAbacusCodeId}
        taskFormAbacusCodeSearch={taskFormAbacusCodeSearch} setTaskFormAbacusCodeSearch={setTaskFormAbacusCodeSearch}
        pendingAbacusCodeSelection={pendingAbacusCodeSelectionForTaskForm}
        clearPendingAbacusCodeSelection={() => setPendingAbacusCodeSelectionForTaskForm(null)}
      />

      <Modal isOpen={isProjectsManagerOpen} onClose={handleCloseProjectsManager} title="Manage Projects" currentTheme={theme}>
        <ProjectManagementView
          projects={projects}
          onSaveNewProjectInline={handleSaveNewProjectFromManagementView} 
          onEditProject={handleOpenProjectFormToEdit} 
          onDeleteProject={handleDeleteProject}
          currentTheme={theme}
        />
      </Modal>
      
      <Modal isOpen={isAbacusCodesManagerOpen} onClose={handleCloseAbacusCodesManager} title="Manage Abacus Codes" currentTheme={theme}>
        <AbacusCodeManagementView
            abacusCodes={abacusCodes}
            onSaveNewAbacusCodeInline={handleSaveNewAbacusCodeFromManagementView} 
            onEditAbacusCode={handleOpenAbacusCodeFormToEdit} 
            onDeleteAbacusCode={handleDeleteAbacusCode}
            currentTheme={theme}
        />
      </Modal>

      <Modal isOpen={isFavoritesManagerOpen} onClose={handleCloseFavoritesManager} title="Manage Favorite Templates" currentTheme={theme}>
        <FavoriteTasksManagementView
          favoriteTaskTemplates={favoriteTaskTemplates}
          onUseFavorite={handleUseFavoriteTemplate}
          onDeleteFavorite={handleDeleteFavoriteTemplate}
          projects={projects}
          abacusCodes={abacusCodes}
          currentTheme={theme}
        />
      </Modal>
      
      <ProjectFormModal
        isOpen={isProjectFormOpen} 
        onClose={handleCloseProjectForm}
        onSaveProject={(project, isNew) => { 
            handleSaveProject(project, isNew);
            handleCloseProjectForm(); 
        }}
        existingProject={editingProject} 
        currentTheme={theme}
      />
      
      <AbacusCodeFormModal
        isOpen={isAbacusCodeFormOpen}
        onClose={handleCloseAbacusCodeForm}
        onSaveAbacusCode={(code, isNew) => {
            handleSaveAbacusCode(code, isNew);
            handleCloseAbacusCodeForm();
        }}
        existingAbacusCode={editingAbacusCode}
        currentTheme={theme}
      />

      {datePickerModalState.isOpen && (
        <DatePickerModal
          isOpen={datePickerModalState.isOpen} onClose={closeDatePickerModal}
          onDateSelect={handleDateSelectedForCopyMove}
          title={`${datePickerModalState.mode === 'copy' ? 'Copy' : 'Move'} Task: "${datePickerModalState.taskName || ''}"`}
          currentTheme={theme} 
          initialDate={getLocalISODateString(currentSelectedDate)}
        />
      )}

      {isManualTimeModalOpen && taskForManualTimeAdjustment && (
        <ManualTimeAdjustmentModal
            isOpen={isManualTimeModalOpen}
            onClose={handleCloseManualTimeModal}
            onApplyAdjustment={handleApplyManualTimeAdjustment}
            task={taskForManualTimeAdjustment}
            currentTheme={theme}
            timeEntries={timeEntries}
        />
      )}

      {confirmationModalState.isOpen && confirmationModalState.onConfirm && (
        <ConfirmationModal
            isOpen={confirmationModalState.isOpen}
            onClose={closeConfirmationModal}
            onConfirm={() => {
              if (confirmationModalState.onConfirm) {
                 confirmationModalState.onConfirm(); 
              }
              closeConfirmationModal(); 
            }}
            title={confirmationModalState.title}
            message={confirmationModalState.message}
            currentTheme={theme}
        />
      )}

      <Modal isOpen={isSettingsModalOpen} onClose={handleCloseSettingsModal} title="Settings" currentTheme={theme}>
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium text-[var(--text-accent)] mb-2">Appearance</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-1">Theme:</p>
            <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />
          </div>
          <div className="pt-3">
             <p className="text-sm text-[var(--text-secondary)] mb-1">Tone Color:</p>
            <ToneSwitcher currentTone={currentTone} setTone={setCurrentTone} />
          </div>
          
          <div className="pt-4 border-t border-[var(--border-color)]">
             <h3 className="text-md font-medium text-[var(--text-accent)] mb-2">Reports</h3>
             <p className="text-sm text-[var(--text-secondary)] mb-3">Generate printable summaries of your work.</p>
             <button
                onClick={handleGenerateWeeklyReport}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-[var(--text-on-accent)] bg-[var(--accent-secondary)] hover:bg-[var(--accent-primary-hover)] rounded-md transition-colors border border-[var(--accent-primary)]"
             >
                <ReportIcon className="w-5 h-5 mr-2"/> 
                Generate Weekly Report (Print)
             </button>
          </div>

        </div>
      </Modal>

      <TaskDetailModal
        isOpen={isTaskDetailModalOpen}
        onClose={handleCloseTaskDetailModal}
        task={taskForDetailView}
        project={taskForDetailView ? projects.find(p => p.id === taskForDetailView.projectId) : undefined}
        abacusCode={taskForDetailView && taskForDetailView.abacusCodeId ? abacusCodes.find(ac => ac.id === taskForDetailView.abacusCodeId) : undefined}
        timeEntriesForTaskOnDate={
          taskForDetailView 
            ? timeEntries.filter(entry => entry.taskId === taskForDetailView.id && getLocalISODateString(new Date(entry.startTime)) === taskForDetailView.date) 
            : []
        }
        currentTheme={theme}
      />
      
      <footer className="text-center py-6 text-sm text-[var(--text-secondary)] border-t border-[var(--border-color)] mt-8">
        <p>&copy; {new Date().getFullYear()} {APP_TITLE}. Modal Management Edition.</p>
      </footer>
    </div>
  );
};

export default App;