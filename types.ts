

export interface Project {
  id: string;
  name: string;
  color: string; // Hex color string
}

export interface AbacusCode {
  id: string;
  code: string; // The actual Abacus code value
}

export interface SubTask {
  id: string;
  name: string;
  isCompleted: boolean;
  order: number;
  createdAt: number;
  timeLogged: number; // in milliseconds, accumulated
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  date: string; // YYYY-MM-DD format
  projectId: string; // Project ID is now mandatory
  abacusCodeId?: string; // Optional Abacus Code ID
  isCompleted: boolean;
  isImportant: boolean;
  order: number; // For drag and drop reordering
  subTasks?: SubTask[]; 
}

export interface FavoriteTaskTemplate {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  abacusCodeId?: string;
}

export interface TimeEntry {
  id:string;
  taskId: string; // Refers to the main parent task
  startTime: number;
  endTime: number;
  duration: number; // in milliseconds
  notes?: string; // For manual adjustments or other info
}

export interface ActiveTimer {
  taskId: string;
  subTaskId?: string; // Present if a sub-task timer is active
  startTime: number;
  intervalId?: number; 
}

export type Theme = 'glass' | 'dark' | 'light';
export type ViewMode = 'dailyTasks' | 'weeklyView'; 
export type ToneColor = 'purple' | 'blue' | 'teal' | 'pink';


export interface DatePickerModalState {
  isOpen: boolean;
  mode: 'copy' | 'move' | null;
  taskId?: string;
  taskName?: string;
  currentTheme?: Theme; 
  viewMode?: ViewMode; 
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  currentTheme?: Theme;
}

export interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProject: (project: Project, isNew: boolean) => void; 
  existingProject?: Project | null;
  currentTheme: Theme;
}

export interface AbacusCodeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAbacusCode: (abacusCode: AbacusCode, isNew: boolean) => void;
  existingAbacusCode?: AbacusCode | null;
  currentTheme: Theme;
}


export interface ThemeSwitcherProps {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

export interface ToneSwitcherProps {
  currentTone: ToneColor;
  setTone: (tone: ToneColor) => void;
}


export interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: Task) => void;
  existingTask?: Task | null;
  projects: Project[];
  abacusCodes: AbacusCode[];
  onSaveProject: (project: Project, isNew: boolean) => void; 
  onSaveAbacusCode: (code: AbacusCode, isNew: boolean) => void; 
  currentTheme: Theme;
  
  taskFormName: string;
  setTaskFormName: (name: string) => void;
  taskFormDescription: string;
  setTaskFormDescription: (desc: string) => void;
  taskFormDate: string; 
  setTaskFormDate: (date: string) => void;
  
  taskFormProjectId: string; 
  setTaskFormProjectId: (id: string) => void; 
  taskFormProjectSearch: string;
  setTaskFormProjectSearch: (search: string) => void;
  pendingProjectSelection: Project | null; 
  clearPendingProjectSelection: () => void;

  taskFormAbacusCodeId: string; 
  setTaskFormAbacusCodeId: (id: string) => void;
  taskFormAbacusCodeSearch: string;
  setTaskFormAbacusCodeSearch: (search: string) => void;
  pendingAbacusCodeSelection: AbacusCode | null;
  clearPendingAbacusCodeSelection: () => void;
}

export interface ManualTimeAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAdjustment: (hours: number, minutes: number, mode: 'add' | 'subtract') => void;
  task?: Task | null;
  currentTheme: Theme;
  timeEntries: TimeEntry[]; 
}

export interface ConfirmationModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: (() => void) | null;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  currentTheme: Theme;
}

export interface DateNavigationToolbarProps {
  currentSelectedDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onGoToToday: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentTheme: Theme;
  onAddTask: () => void; 
  isProjectsManagerOpen: boolean; 
  isAbacusCodesManagerOpen: boolean; 
  isFavoritesManagerOpen: boolean; 
}

export interface TaskItemProps {
  task: Task;
  project?: Project;
  abacusCode?: AbacusCode; 
  activeTimer: ActiveTimer | null;
  onStartTimer: (taskId: string, subTaskId?: string) => void; // Updated
  onStopTimer: (taskId: string) => void; // Keeps taskId, subTaskId is known from activeTimer
  onEditTask: (task: Task) => void; 
  onDeleteTask: (taskId: string) => void;
  onCopyTask: (task: Task) => void;
  onMoveTask: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onToggleImportant: (taskId: string) => void;
  onOpenManualTimeModal: (task: Task) => void;
  onUpdateTaskInline: (taskId: string, updates: Partial<Pick<Task, 'name' | 'description'>>) => void; 
  onReorderTask: (draggedTaskId: string, targetTaskId: string | null) => void; 
  timeEntries: TimeEntry[];
  currentTheme: Theme;
  isDeleting: boolean; 
  onSaveAsFavorite: (task: Task) => void; 
  onAddSubTask: (taskId: string, subTaskName: string) => void;
  onToggleSubTaskComplete: (taskId: string, subTaskId: string) => void;
  onDeleteSubTask: (taskId: string, subTaskId: string) => void;
  onStartSubTaskTimer: (taskId: string, subTaskId: string) => void; // New
  onStopSubTaskTimer: (taskId: string, subTaskId: string) => void; // New
}

export interface TaskListProps {
  tasks: Task[]; 
  projects: Project[]; 
  abacusCodes: AbacusCode[]; 
  currentSelectedDate: Date;
  activeTimer: ActiveTimer | null;
  timeEntries: TimeEntry[];
  onStartTimer: (taskId: string, subTaskId?: string) => void; // Updated
  onStopTimer: (taskId: string) => void;
  onEditTask: (task: Task) => void; 
  onDeleteTask: (taskId: string) => void;
  onCopyTask: (task: Task) => void;
  onMoveTask: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onToggleImportant: (taskId: string) => void;
  onOpenManualTimeModal: (task: Task) => void;
  onUpdateTaskInline: (taskId: string, updates: Partial<Pick<Task, 'name' | 'description'>>) => void; 
  onReorderTask: (draggedTaskId: string, targetTaskId: string | null, taskDate: string) => void; 
  onSaveAsFavorite: (task: Task) => void; 
  currentTheme: Theme;
  deletingTaskIds: string[]; 
  onAddSubTask: (taskId: string, subTaskName: string) => void;
  onToggleSubTaskComplete: (taskId: string, subTaskId: string) => void;
  onDeleteSubTask: (taskId: string, subTaskId: string) => void;
  onStartSubTaskTimer: (taskId: string, subTaskId: string) => void; // New
  onStopSubTaskTimer: (taskId: string, subTaskId: string) => void; // New
}

// Props for management views
export interface ProjectManagementViewProps {
  projects: Project[];
  onSaveNewProjectInline: (name: string, color: string) => void; 
  onEditProject: (project: Project) => void; 
  onDeleteProject: (projectId: string) => void;
  currentTheme: Theme;
}

export interface AbacusCodeManagementViewProps {
  abacusCodes: AbacusCode[];
  onSaveNewAbacusCodeInline: (code: string) => void; 
  onEditAbacusCode: (abacusCode: AbacusCode) => void; 
  onDeleteAbacusCode: (abacusCodeId: string) => void;
  currentTheme: Theme;
}

export interface HeaderProps {
  onOpenProjectsManager: () => void; 
  onOpenAbacusCodesManager: () => void;
  onOpenFavoritesManager: () => void; 
  onOpenSettingsModal: () => void; 
  isProjectsManagerOpen: boolean; 
  isAbacusCodesManagerOpen: boolean; 
  isFavoritesManagerOpen: boolean; 
}

export interface WeeklyDashboardProps {
  tasksForWeek: Task[];
  timeEntriesForWeek: TimeEntry[];
  projects: Project[];
  currentTheme: Theme;
  daysInWeek: Date[]; 
  totalWeekDuration: number; 
}

export interface DayCardProps {
  date: Date;
  timeEntries: TimeEntry[];
  tasks: Task[];
  projects: Project[];
  abacusCodes: AbacusCode[];
  currentTheme: Theme;
  viewMode: ViewMode;
  onDayCardClick?: (date: Date) => void; 
  onTaskItemClick?: (taskId: string) => void; 
}

export interface WeekViewProps {
  currentDateForWeek: Date;
  timeEntries: TimeEntry[];
  tasks: Task[];
  projects: Project[];
  abacusCodes: AbacusCode[];
  currentTheme: Theme;
  viewMode: ViewMode;
  onDaySelect: (date: Date) => void; 
  onTaskSelectForDetail: (taskId: string) => void; 
}

export interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  project?: Project;
  abacusCode?: AbacusCode;
  timeEntriesForTaskOnDate: TimeEntry[]; 
  currentTheme: Theme;
}

// For Printable Report
export interface ProjectTimeSummaryForReport {
  projectName: string;
  projectColor: string;
  totalHoursFormatted: string;
}

export interface AbacusCodeTimeSummaryForReport {
  abacusCode: string;
  totalHoursFormatted: string;
}

export interface PrintableWeeklyReportProps {
  reportTitle: string;
  weekPeriod: string;
  generatedDate: string;
  totalWeekHoursFormatted: string;
  projectSummaries: ProjectTimeSummaryForReport[];
  abacusCodeSummaries: AbacusCodeTimeSummaryForReport[];
}

// For Favorite Task Templates
export interface FavoriteTaskTemplateListItemProps {
  template: FavoriteTaskTemplate;
  onUse: (template: FavoriteTaskTemplate) => void;
  onDelete: (templateId: string) => void;
  projects: Project[]; 
  abacusCodes: AbacusCode[]; 
  currentTheme: Theme;
}

export interface FavoriteTasksManagementViewProps {
  favoriteTaskTemplates: FavoriteTaskTemplate[];
  onUseFavorite: (template: FavoriteTaskTemplate) => void;
  onDeleteFavorite: (templateId: string) => void;
  projects: Project[];
  abacusCodes: AbacusCode[];
  currentTheme: Theme;
}
