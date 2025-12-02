import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-200 inline-flex items-center justify-center';

  const variantClasses = {
    primary: 'bg-accent-500 text-white hover:bg-accent-600 shadow-md hover:shadow-lg disabled:bg-accent-300 disabled:cursor-not-allowed',
    secondary: 'bg-navy-800 text-white hover:bg-navy-900 shadow-md hover:shadow-lg disabled:bg-navy-400 disabled:cursor-not-allowed',
    outline: 'border-2 border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white disabled:border-navy-400 disabled:text-navy-400 disabled:cursor-not-allowed',
  };

  const sizeClasses = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};
