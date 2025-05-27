

import React from 'react';

export const APP_TITLE = "Task Manager Pro";

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
  </svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
  </svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

export const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.347-9Zm5.493 0a.75.75 0 1 0-1.5.058l-.347 9a.75.75 0 1 0 1.499-.058l.347-9Z" clipRule="evenodd" />
  </svg>
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
  </svg>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
  </svg>
);

export const ChevronUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
  </svg>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.836 17.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.894a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.106 6.106a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-3.51 1.713-6.625 4.372-8.552a.75.75 0 01.819.162z" clipRule="evenodd" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M10.5 3.75a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V3.75z" clipRule="evenodd" />
    <path d="M7.846 6.962a.75.75 0 011.06 0l.741.741a.75.75 0 010 1.06l-.741.741a.75.75 0 01-1.06-1.06l.188-.188-1.027-1.027-.188.188a.75.75 0 11-1.06-1.06l.741-.741a.75.75 0 011.06 0l.188.188 1.027 1.027.188-.188zM15.154 6.962a.75.75 0 011.06 0l.741.741a.75.75 0 010 1.06l-.741.741a.75.75 0 11-1.06-1.06l.188-.188-1.027-1.027-.188.188a.75.75 0 01-1.06-1.06l.741-.741a.75.75 0 011.06 0l.188.188 1.027 1.027.188-.188zM9.504 15.922a.75.75 0 01.75-.75h3.492a.75.75 0 010 1.5H10.254a.75.75 0 01-.75-.75zM12 12.75a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75zM3.75 10.5a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V10.5zM16.5 10.5a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V10.5zM7.846 13.038a.75.75 0 011.061 0l.741.741a.75.75 0 010 1.06l-.741.741a.75.75 0 11-1.06-1.06l.188-.188-1.027-1.027-.188.188a.75.75 0 01-1.061-1.06l.741-.741a.75.75 0 011.061 0l.188.188 1.027 1.027.188-.188zM15.154 13.038a.75.75 0 011.061 0l.741.741a.75.75 0 010 1.06l-.741.741a.75.75 0 11-1.06-1.06l.188-.188-1.027-1.027-.188.188a.75.75 0 01-1.061-1.06l.741-.741a.75.75 0 011.061 0l.188.188 1.027 1.027.188-.188z" clipRule="evenodd" />
    <path d="M10.433 2.078a.75.75 0 01.067 1.06l-.412.413a.75.75 0 11-1.06-1.06l.412-.413a.75.75 0 01.993 0zM13.567 2.078a.75.75 0 00-.067 1.06l.412.413a.75.75 0 101.06-1.06l-.412-.413a.75.75 0 00-.993 0zM10.433 20.422a.75.75 0 00.067-1.06l-.412-.413a.75.75 0 10-1.06 1.06l.412.413a.75.75 0 00.993 0zM13.567 20.422a.75.75 0 01-.067-1.06l.412-.413a.75.75 0 111.06 1.06l-.412.413a.75.75 0 01-.993 0zM4.567 9.078a.75.75 0 00-.067 1.06l.412.413a.75.75 0 101.06-1.06l-.412-.413a.75.75 0 00-.993 0zM1.433 12.922a.75.75 0 01.067-1.06l.412-.413a.75.75 0 111.06 1.06l-.412.413a.75.75 0 01-.993 0zM4.567 14.922a.75.75 0 01-.067-1.06l.412-.413a.75.75 0 111.06 1.06l-.412.413a.75.75 0 01-.993 0zM19.433 9.078a.75.75 0 01.067 1.06l-.412.413a.75.75 0 11-1.06-1.06l.412-.413a.75.75 0 01.993 0zM22.567 12.922a.75.75 0 00-.067-1.06l.412-.413a.75.75 0 101.06 1.06l-.412.413a.75.75 0 00-.993 0zM19.433 14.922a.75.75 0 00.067-1.06l-.412-.413a.75.75 0 10-1.06 1.06l.412.413a.75.75 0 00.993 0z" />
  </svg>
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>
);


export const MoveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => ( // Used for Date Picker and Daily Task View Icon
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zM5.25 6.75c-.966 0-1.75.784-1.75 1.75v11.25c0 .966.784 1.75 1.75 1.75h13.5c.966 0 1.75-.784 1.75-1.75V8.5c0-.966-.784-1.75-1.75-1.75H5.25z" clipRule="evenodd" />
  </svg>
);

export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => ( // Used for "Show Weekly View"
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a.75.75 0 010-1.113zM12.001 19.5c3.978 0 7.606-2.54 9.079-6.431v-.138c-1.473-3.889-5.101-6.431-9.079-6.431S4.394 9.042 2.921 12.932V13.07c1.473 3.891 5.101 6.43 9.079 6.43z" clipRule="evenodd" />
  </svg>
);

export const EyeSlashIcon: React.FC<{ className?: string }> = ({ className }) => ( // Used for "Hide Weekly View"
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L8.717 5.22A11.25 11.25 0 0122.676 12.553zM12.001 15.75a3.75 3.75 0 116.353-4.506l-1.529-1.529a2.25 2.25 0 00-3.182-3.182L12.001 8.032a.75.75 0 01-.13.125 3.75 3.75 0 01-3.352 6.19L12.001 15.75z" />
    <path d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c1.267 0 2.49.19 3.648.544l-1.578 1.578A9.75 9.75 0 0012.001 5.25c-3.978 0-7.606 2.54-9.079 6.431v.138a9.78 9.78 0 001.908 3.03L1.323 11.447z" />
  </svg>
);

export const FolderIcon: React.FC<{ className?: string }> = ({ className }) => ( // For Project Management View
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.25l-1.5-1.5A1.5 1.5 0 0 0 11.25 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Z" />
  </svg>
);

export const CalculatorIcon: React.FC<{ className?: string }> = ({ className }) => ( // For Abacus Code Management
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M18.75 2.25H5.25C4.42157 2.25 3.75 2.92157 3.75 3.75V20.25C3.75 21.0784 4.42157 21.75 5.25 21.75H18.75C19.5784 21.75 20.25 21.0784 20.25 20.25V3.75C20.25 2.92157 19.5784 2.25 18.75 2.25ZM5.25 3.75H18.75V7.5H5.25V3.75Z" />
    <path d="M7.5 10.5H6V12H7.5V10.5Z" />
    <path d="M7.5 13.5H6V15H7.5V13.5Z" />
    <path d="M7.5 16.5H6V18H7.5V16.5Z" />
    <path d="M10.5 10.5H9V12H10.5V10.5Z" />
    <path d="M10.5 13.5H9V15H10.5V13.5Z" />
    <path d="M10.5 16.5H9V18H10.5V16.5Z" />
    <path d="M13.5 10.5H12V12H13.5V10.5Z" />
    <path d="M13.5 13.5H12V15H13.5V13.5Z" />
    <path d="M13.5 16.5H12V18H13.5V16.5Z" />
    <path d="M16.5 10.5H15V12H16.5V10.5Z" />
    <path d="M16.5 13.5H15V18H16.5V13.5Z" />
  </svg>
);

export const CheckboxIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
  </svg>
);

export const CheckboxCheckedIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06l-3.002 3.001-1.502-1.502a.75.75 0 00-1.06 1.061l2.252 2.252a.75.75 0 001.06 0l3.752-3.751z" clipRule="evenodd" />
  </svg>
);

export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.479.038.673.646.314.986l-4.061 3.693a.563.563 0 00-.163.63l.932 5.42c.079.461-.363.825-.763.584l-4.91-2.784a.563.563 0 00-.611 0l-4.91 2.784c-.4.241-.842-.123-.763-.584l.932-5.42a.563.563 0 00-.163-.63L2.021 10.383c-.359-.34-.165-.948.314-.986l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

export const StarFilledIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006a.42.42 0 00.316.292l5.252.762c1.158.169 1.632 1.534.796 2.338l-3.798 3.66a.42.42 0 00-.122.39l.9 5.228c.196 1.14-.996 2.022-1.988 1.46l-4.694-2.466a.42.42 0 00-.39 0l-4.694 2.466c-.992.562-2.184-.32-1.988-1.46l.9-5.228a.42.42 0 00-.122-.39L.462 11.608c-.836-.804-.362-2.17.796-2.338l5.252-.762a.42.42 0 00.316-.292L10.788 3.21z" clipRule="evenodd" />
  </svg>
);

export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const EllipsisVerticalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
  </svg>
);

// Simpler CogIcon for broader compatibility and cleaner look:
export const CogIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
      <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.947 1.525L7.105 8.45c-.305.918-.401 1.86-.217 2.766C7.069 12.68 7.97 13.5 9 13.5H15c1.03 0 1.93-.82 2.112-1.284.184-.906.088-1.848-.217-2.766L14.87 3.775A1.999 1.999 0 0012.922 2.25h-1.844zM9 16.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM15 16.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM8.25 12C8.25 12.828 7.578 13.5 6.75 13.5S5.25 12.828 5.25 12V9.75A2.25 2.25 0 017.5 7.5h9A2.25 2.25 0 0118.75 9.75V12c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V11.25a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V12zM19.906 8.159a2.25 2.25 0 00-3.812 0l-1.028 1.542a2.25 2.25 0 01-1.947 1.05H10.88a2.25 2.25 0 01-1.947-1.05L7.906 8.16a2.25 2.25 0 00-3.812 0L2.25 12l1.844 3.841a2.25 2.25 0 003.812 0l1.028-1.542a2.25 2.25 0 011.947-1.05h2.238a2.25 2.25 0 011.947 1.05l1.028 1.542a2.25 2.25 0 003.812 0L21.75 12l-1.844-3.841z" clipRule="evenodd" />
    </svg>
  );

export const BookmarkIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className={className || "w-6 h-6"}>
    {filled ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    )}
  </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => ( // For "Use" button
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06l-3.002 3.001-1.502-1.502a.75.75 0 00-1.06 1.061l2.252 2.252a.75.75 0 001.06 0l3.752-3.751z" clipRule="evenodd" />
  </svg>
);
