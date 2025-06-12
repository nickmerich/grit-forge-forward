
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface BrutalistProgressBarProps {
  progress: number; // 0-100
  className?: string;
  animated?: boolean;
  label?: string;
}

const BrutalistProgressBar = ({ 
  progress, 
  className, 
  animated = true,
  label 
}: BrutalistProgressBarProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setDisplayProgress(progress), 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="brutalist-h2 text-sm">{label}</span>
          <span className="brutalist-h2 text-sm">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="brutalist-progress-bar">
        <div 
          className="brutalist-progress-fill"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
};

export default BrutalistProgressBar;
