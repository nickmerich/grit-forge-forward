
import React from 'react';
import { usePremiumContent } from '@/hooks/usePremiumContent';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';
import BrutalistNavigation from '@/components/BrutalistNavigation';

const PremiumContent = () => {
  const { content, isLoading, purchaseContent, hasPurchased } = usePremiumContent();

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'course': return '🎓';
      case 'guide': return '📚';
      case 'template': return '📋';
      case 'workbook': return '📝';
      default: return '📄';
    }
  };

  return (
    <div className="brutalist-container pb-20">
      <div className="brutalist-header">
        <h1 className="brutalist-h1 text-center">PREMIUM CONTENT</h1>
        <p className="text-center font-bold">ACCELERATE YOUR SUCCESS</p>
      </div>

      <div className="brutalist-section space-y-6">
        {content.map((item) => (
          <BrutalistCard key={item.id}>
            <div className="flex items-start space-x-4">
              <span className="text-3xl">{getContentIcon(item.content_type)}</span>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-700 mb-4">{item.description}</p>
                
                {item.preview_content && (
                  <div className="bg-gray-100 p-3 rounded mb-4">
                    <p className="text-sm font-bold">PREVIEW:</p>
                    <p className="text-sm">{item.preview_content}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-bold text-xl">{formatPrice(item.price)}</span>
                  
                  {hasPurchased(item.id) ? (
                    <BrutalistButton variant="secondary" disabled>
                      PURCHASED ✓
                    </BrutalistButton>
                  ) : (
                    <BrutalistButton
                      onClick={() => purchaseContent(item.id, item.price)}
                      disabled={isLoading}
                      variant="accent"
                    >
                      {isLoading ? 'PURCHASING...' : 'BUY NOW'}
                    </BrutalistButton>
                  )}
                </div>
              </div>
            </div>
          </BrutalistCard>
        ))}

        {content.length === 0 && (
          <BrutalistCard>
            <div className="text-center py-8">
              <h3 className="font-bold text-lg mb-2">CONTENT COMING SOON</h3>
              <p className="text-gray-600">We're working on amazing resources to help you succeed!</p>
            </div>
          </BrutalistCard>
        )}
      </div>

      <BrutalistNavigation 
        items={[
          { label: 'DASHBOARD', path: '/', icon: '🏠' },
          { label: 'GOALS', path: '/create-goal', icon: '🎯' },
          { label: 'CONTENT', path: '/content', icon: '📚' },
          { label: 'COACHING', path: '/coaching', icon: '👨‍🏫' }
        ]}
      />
    </div>
  );
};

export default PremiumContent;
