
import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalistInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  label?: string;
  error?: string;
}

const BrutalistInput = ({
  value,
  onChange,
  placeholder,
  className,
  maxLength,
  minLength,
  required,
  label,
  error
}: BrutalistInputProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="brutalist-h2 text-sm block">
          {label}
          {required && <span className="text-brutalist-green ml-1">*</span>}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        required={required}
        className={cn(
          "brutalist-input focus-brutalist",
          error && "border-brutalist-green shadow-brutalist-green",
          className
        )}
      />
      {error && (
        <p className="text-sm font-bold text-brutalist-green">{error}</p>
      )}
      {maxLength && (
        <p className="text-xs font-bold text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
};

export default BrutalistInput;
