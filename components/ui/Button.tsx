import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'stamp' | 'stamp-solid';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'font-bold uppercase tracking-[0.02em] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';

  const variants = {
    // Ink fill — hover stamps it
    primary: 'bg-menu-ink-900 text-menu-paper-50 border-menu border-menu-ink-900 hover:bg-menu-stamp-500 hover:border-menu-stamp-500',

    secondary: 'border-menu border-menu-ink-900 text-menu-ink-900 hover:bg-menu-ink-900 hover:text-menu-paper-50',

    outline: 'border-menu border-menu-ink-300 text-menu-ink-700 hover:border-menu-ink-900 hover:bg-menu-paper-300',

    ghost: 'text-menu-ink-700 hover:bg-menu-paper-300',

    // The one accent — stamp fill, paper text
    stamp: 'border-menu border-menu-stamp-500 text-menu-stamp-600 hover:bg-menu-stamp-500 hover:text-menu-paper-50',

    // Page-level primary CTAs — filled stamp (design-lab's cta--stamp)
    'stamp-solid': 'border-menu border-menu-stamp-500 bg-menu-stamp-500 text-menu-paper-50 hover:bg-menu-stamp-600 hover:border-menu-stamp-600',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-sm',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
