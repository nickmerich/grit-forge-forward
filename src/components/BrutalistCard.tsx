
import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalistCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
}

const BrutalistCard = ({ children, className, onClick, glow = false }: BrutalistCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "brutalist-card",
        glow && "brutalist-glow",
        onClick && "cursor-pointer hover:shadow-brutalist-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-200",
        className
      )}
    >
      {children}
    </div>
  );
};

export default BrutalistCard;
