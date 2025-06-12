
import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalistButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const BrutalistButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className,
  type = 'button'
}: BrutalistButtonProps) => {
  const baseClasses = "brutalist-button";
  const variantClasses = {
    primary: "brutalist-button",
    secondary: "brutalist-button-secondary", 
    accent: "brutalist-button-accent"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        variantClasses[variant],
        disabled && "opacity-50 cursor-not-allowed hover:shadow-brutalist hover:translate-x-0 hover:translate-y-0",
        className
      )}
    >
      {children}
    </button>
  );
};

export default BrutalistButton;
