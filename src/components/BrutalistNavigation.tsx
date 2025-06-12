
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

interface BrutalistNavigationProps {
  items: NavItem[];
}

const BrutalistNavigation = ({ items }: BrutalistNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="brutalist-nav">
      <div className="flex">
        {items.map((item, index) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "brutalist-nav-item",
              location.pathname === item.path && "bg-brutalist-green text-brutalist-black"
            )}
          >
            {item.icon && <span className="block text-xl mb-1">{item.icon}</span>}
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BrutalistNavigation;
