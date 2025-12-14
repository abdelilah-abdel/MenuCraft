import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
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
  const baseStyles = 'font-medium uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';

  const variants = {
    primary: 'bg-menu-charcoal-700 text-menu-cream-50 hover:bg-menu-charcoal-800 border-menu border-menu-charcoal-700 hover:border-menu-charcoal-800',

    secondary: 'border-menu border-menu-charcoal-700 text-menu-charcoal-700 hover:bg-menu-charcoal-700 hover:text-menu-cream-50',

    outline: 'border-menu border-menu-charcoal-300 text-menu-charcoal-700 hover:border-menu-charcoal-700 hover:bg-menu-cream-200',

    ghost: 'text-menu-charcoal-700 hover:bg-menu-cream-300',

    gold: 'border-menu border-menu-gold-500 text-menu-gold-600 hover:bg-menu-gold-500 hover:text-menu-charcoal-900',
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
