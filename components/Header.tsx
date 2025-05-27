import React from 'react';
import { FolderIcon, CalculatorIcon, CogIcon, BookmarkIcon } from '../constants';
import { HeaderProps } from '../types';
import logo from '../assets/logoss.svg';

const Header: React.FC<HeaderProps> = ({
  onOpenProjectsManager,
  onOpenAbacusCodesManager,
  onOpenFavoritesManager,
  onOpenSettingsModal,
  isProjectsManagerOpen,
  isAbacusCodesManagerOpen,
  isFavoritesManagerOpen,
}) => {

  const ManagementViewButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    title?: string;
    disabled?: boolean;
  }> = ({ isActive, onClick, icon, label, title, disabled }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-md transition-colors border border-[var(--border-color)] flex items-center space-x-2
                  ${isActive
                    ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)] shadow-inner'
                    : 'bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
      aria-pressed={isActive}
      title={title || `Open ${label} Management`}
      disabled={disabled}
    >
      {icon}
      <span className="hidden sm:inline text-xs">{label}</span>
    </button>
  );

  const otherManagerOpen = isProjectsManagerOpen || isAbacusCodesManagerOpen || isFavoritesManagerOpen;

  return (
    <header
      className={`p-3 sm:p-4 bg-[var(--bg-card)] border-b border-[var(--border-color)] shadow-lg`}
    >
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center space-y-3 lg:space-y-0">
        <img
          src={logo}
          alt="Chronos Application Logo"
          className="h-10 object-contain"
        />

        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          <div className="flex items-center space-x-1 p-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
            <ManagementViewButton
              isActive={isProjectsManagerOpen}
              onClick={onOpenProjectsManager}
              icon={<FolderIcon className="w-4 h-4"/>}
              label="Projects"
              disabled={otherManagerOpen && !isProjectsManagerOpen}
            />
            <ManagementViewButton
              isActive={isAbacusCodesManagerOpen}
              onClick={onOpenAbacusCodesManager}
              icon={<CalculatorIcon className="w-4 h-4" />}
              label="Abacus"
              disabled={otherManagerOpen && !isAbacusCodesManagerOpen}
            />
            <ManagementViewButton
              isActive={isFavoritesManagerOpen}
              onClick={onOpenFavoritesManager}
              icon={<BookmarkIcon className="w-4 h-4" filled={isFavoritesManagerOpen} />}
              label="Favorites"
              disabled={otherManagerOpen && !isFavoritesManagerOpen}
            />
          </div>

          <button
            onClick={onOpenSettingsModal}
            className={`p-2 rounded-md transition-colors border border-[var(--border-color)] flex items-center space-x-2
                       bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-[var(--text-secondary)] hover:text-[var(--text-main)]
                       ${otherManagerOpen ? 'opacity-50 cursor