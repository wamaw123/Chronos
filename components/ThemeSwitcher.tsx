
import React from 'react';
import { ThemeSwitcherProps, Theme } from '../types'; // Use ThemeSwitcherProps from types.ts
import { SunIcon, MoonIcon, SparklesIcon } from '../constants';

const themes: Theme[] = ['glass', 'dark', 'light'];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, setTheme }) => {
  const getIconForTheme = (theme: Theme, isActive: boolean) => {
    const iconClass = `w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-[var(--text-on-accent)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-main)]'}`;
    switch (theme) {
      case 'glass':
        return <SparklesIcon className={iconClass} />;
      case 'dark':
        return <MoonIcon className={iconClass} />;
      case 'light':
        return <SunIcon className={iconClass} />;
      default:
        return null;
    }
  };
  
  const getButtonLabel = (theme: Theme) => {
    switch (theme) {
      case 'glass': return 'Glass';
      case 'dark': return 'Dark';
      case 'light': return 'Light';
    }
  }

  return (
    <div className="flex items-center space-x-1 p-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
      {themes.map((themeOption) => (
        <button
          key={themeOption}
          onClick={() => setTheme(themeOption)}
          className={`group p-1 sm:p-1.5 rounded transition-colors text-xs font-medium
            ${currentTheme === themeOption 
              ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)] shadow-inner' 
              : 'bg-transparent hover:bg-[var(--bg-button-hover)] text-[var(--text-secondary)] hover:text-[var(--text-main)]'
            }`}
          aria-pressed={currentTheme === themeOption}
          title={`Switch to ${getButtonLabel(themeOption)} theme`}
        >
          {getIconForTheme(themeOption, currentTheme === themeOption)}
          <span className="sr-only">Switch to ${getButtonLabel(themeOption)} theme</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;