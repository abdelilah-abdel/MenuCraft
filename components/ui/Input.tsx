import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-menu-ink-700 uppercase tracking-[0.14em] mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 bg-menu-paper-50 border border-menu-ink-300 text-menu-ink-900 focus:outline-none focus:border-menu-stamp-500 focus:shadow-[0_0_0_3px_rgba(196,49,31,0.18)] transition-colors placeholder:text-menu-ink-400 ${
          error ? 'border-red-500 focus:border-red-600 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.18)]' : 'hover:border-menu-ink-700'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-bold text-menu-ink-900 uppercase tracking-[0.14em] mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full px-4 py-3 bg-menu-paper-50 border border-menu-ink-300 text-menu-ink-900 focus:outline-none focus:border-menu-stamp-500 focus:shadow-[0_0_0_3px_rgba(196,49,31,0.18)] resize-vertical transition-colors placeholder:text-menu-ink-400 ${
          error ? 'border-red-500 focus:border-red-600 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.18)]' : 'hover:border-menu-ink-700'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
};
