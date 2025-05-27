
export const getStartOfWeek = (date: Date, weekStartsOn: number = 1 /* 0 for Sun, 1 for Mon */): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
  return date.toLocaleDateString(undefined, options || { month: 'short', day: 'numeric' });
};

export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDuration = (milliseconds: number): string => {
  if (milliseconds <= 0) return '0s'; 
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let result = '';
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0 || (hours > 0 && seconds >= 0)) result += `${minutes}m `; 
  if (seconds > 0 || (hours === 0 && minutes === 0)) result += `${seconds}s`; 
  
  return result.trim();
};

// Generates a YYYY-MM-DD string based on the local date parts of the Date object.
export const getLocalISODateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// This function remains but should be used carefully, primarily for contexts explicitly needing UTC date string.
// For general app logic involving task dates, prefer getLocalISODateString.
export const getISODateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};


export const getDaysInWeek = (startDate: Date): Date[] => {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(startDate, i));
  }
  return days;
};

export const adjustTimeEntryDate = (originalStartTime: number, originalEndTime: number, originalDuration: number, newLocalDateString: string): { newStartTime: number; newEndTime: number } => {
  const originalStartLocalDay = new Date(originalStartTime);
  originalStartLocalDay.setHours(0, 0, 0, 0); 

  const timeOfDayOffset = originalStartTime - originalStartLocalDay.getTime(); 

  const [year, month, day] = newLocalDateString.split('-').map(Number);
  // Create the new date ensuring it's interpreted as local midnight
  const newTargetLocalDate = new Date(year, month - 1, day, 0, 0, 0, 0); 

  const newStartTime = newTargetLocalDate.getTime() + timeOfDayOffset;
  const newEndTime = newStartTime + originalDuration;

  return { newStartTime, newEndTime };
};
