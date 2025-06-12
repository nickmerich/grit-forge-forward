
import React from 'react';
import BrutalistButton from '@/components/BrutalistButton';

interface RewardFiltersProps {
  filter: 'all' | 'free' | 'premium';
  onFilterChange: (filter: 'all' | 'free' | 'premium') => void;
}

const RewardFilters = ({ filter, onFilterChange }: RewardFiltersProps) => {
  return (
    <div className="flex space-x-2 mb-6">
      <BrutalistButton
        variant={filter === 'all' ? 'primary' : 'secondary'}
        onClick={() => onFilterChange('all')}
      >
        ALL
      </BrutalistButton>
      <BrutalistButton
        variant={filter === 'free' ? 'primary' : 'secondary'}
        onClick={() => onFilterChange('free')}
      >
        FREE
      </BrutalistButton>
      <BrutalistButton
        variant={filter === 'premium' ? 'primary' : 'secondary'}
        onClick={() => onFilterChange('premium')}
      >
        PRO ⭐
      </BrutalistButton>
    </div>
  );
};

export default RewardFilters;
