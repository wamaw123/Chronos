
import React from 'react';
import { ToneSwitcherProps, ToneColor } from '../types';

interface ToneOption {
  name: ToneColor;
  label: string;
  colorClass: string; // Tailwind bg class for the swatch
  accentVar: string; // CSS variable for its primary accent color
}

// Define the available tones and their visual representation
const toneOptions: ToneOption[] = [
  { name: 'purple', label: 'Purple', colorClass: 'bg-[#9333ea]', accentVar: 'var(--tone-purple-accent-primary)' },
  { name: 'blue', label: 'Blue', colorClass: 'bg-[#2563eb]', accentVar: 'var(--tone-blue-accent-primary)' },
  { name: 'teal', label: 'Teal', colorClass: 'bg-[#0d9488]', accentVar: 'var(--tone-teal-accent-primary)' },
  { name: 'pink', label: 'Pink', colorClass: 'bg-[#db2777]', accentVar: 'var(--tone-pink-accent-primary)' },
];

const ToneSwitcher: React.FC<ToneSwitcherProps> = ({ currentTone, setTone }) => {
  return (
    <div className="flex items-center space-x-2 p-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
      {toneOptions.map((toneOption) => (
        <button
          key={toneOption.name}
          onClick={() => setTone(toneOption.name)}
          className={`group w-full p-1.5 sm:p-2 rounded transition-colors text-xs font-medium flex flex-col items-center space-y-1
            ${currentTone === toneOption.name 
              ? 'ring-2 ring-offset-1 ring-offset-[var(--bg-card)]' 
              : 'hover:bg-[var(--bg-button-hover)]'
            }`}
          style={currentTone === toneOption.name ? { borderColor: toneOption.accentVar, backgroundColor: 'var(--bg-button-hover)' } : { borderColor: 'var(--border-color)'}}
          aria-pressed={currentTone === toneOption.name}
          title={`Switch to ${toneOption.label} tone`}
        >
          <span 
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/20 shadow-inner ${toneOption.colorClass}`}
            style={{ backgroundColor: toneOption.accentVar }} // Use actual accent color for swatch
          ></span>
          <span className={`
            ${currentTone === toneOption.name ? 'text-[var(--text-accent)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-main)]'}
          `}>
            {toneOption.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ToneSwitcher;
