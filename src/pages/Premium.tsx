
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';
import BrutalistNavigation from '@/components/BrutalistNavigation';

const Premium = () => {
  const navigate = useNavigate();
  const { isPremium, isLoading, upgradeToPremium } = useSubscription();

  if (isPremium) {
    return (
      <div className="brutalist-container pb-20">
        <div className="brutalist-header">
          <h1 className="brutalist-h1 text-center">GRYT PRO</h1>
          <p className="text-center font-bold text-lg text-green-600">ACTIVE SUBSCRIPTION</p>
        </div>

        <div className="brutalist-section">
          <BrutalistCard>
            <h2 className="brutalist-h2 mb-6 text-center">YOU'RE PRO! 🚀</h2>
            <div className="space-y-4">
              <div className="text-center">
                <p className="font-bold mb-4">You have access to all premium features:</p>
                <ul className="text-left space-y-2">
                  <li>✅ Advanced AI Coach</li>
                  <li>✅ Multi-Goal Tracking (up to 5 goals)</li>
                  <li>✅ Analytics Dashboard</li>
                  <li>✅ Custom Challenges</li>
                  <li>✅ Priority Support</li>
                  <li>✅ Exclusive Rewards</li>
                </ul>
              </div>
              <BrutalistButton 
                onClick={() => navigate('/')}
                className="w-full"
              >
                BACK TO DASHBOARD
              </BrutalistButton>
            </div>
          </BrutalistCard>
        </div>

        <BrutalistNavigation 
          items={[
            { label: 'DASHBOARD', path: '/', icon: '🏠' },
            { label: 'GOALS', path: '/create-goal', icon: '🎯' },
            { label: 'REWARDS', path: '/rewards', icon: '🏆' },
            { label: 'PRO', path: '/premium', icon: '⭐' }
          ]}
        />
      </div>
    );
  }

  return (
    <div className="brutalist-container pb-20">
      <div className="brutalist-header">
        <h1 className="brutalist-h1 text-center">GRYT PRO</h1>
        <p className="text-center font-bold text-lg">UNLOCK YOUR FULL POTENTIAL</p>
      </div>

      <div className="brutalist-section space-y-6">
        <BrutalistCard>
          <div className="text-center mb-6">
            <h2 className="brutalist-h2 mb-2">$9.99/MONTH</h2>
            <p className="font-bold text-gray-600">OR $99/YEAR (SAVE 2 MONTHS)</p>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-bold text-xl mb-4">PREMIUM FEATURES:</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🧠</span>
                <div>
                  <h4 className="font-bold">ADVANCED AI COACH</h4>
                  <p className="text-sm">Personalized strategies based on your personality and goal history</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-bold">MULTI-GOAL TRACKING</h4>
                  <p className="text-sm">Manage up to 5 simultaneous goals with priority weighting</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-bold">ANALYTICS DASHBOARD</h4>
                  <p className="text-sm">Deep insights into your productivity patterns and success factors</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <h4 className="font-bold">EXCLUSIVE REWARDS</h4>
                  <p className="text-sm">Access to premium brand partnerships and experiences</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="font-bold">PRIORITY SUPPORT</h4>
                  <p className="text-sm">Direct access to coaching team for complex goals</p>
                </div>
              </div>
            </div>
          </div>

          <BrutalistButton
            onClick={upgradeToPremium}
            disabled={isLoading}
            variant="accent"
            className="w-full"
          >
            {isLoading ? 'UPGRADING...' : 'UPGRADE TO PRO'}
          </BrutalistButton>

          <p className="text-center text-sm text-gray-600 mt-4">
            Cancel anytime. No commitment.
          </p>
        </BrutalistCard>
      </div>

      <BrutalistNavigation 
        items={[
          { label: 'DASHBOARD', path: '/', icon: '🏠' },
          { label: 'GOALS', path: '/create-goal', icon: '🎯' },
          { label: 'REWARDS', path: '/rewards', icon: '🏆' },
          { label: 'PRO', path: '/premium', icon: '⭐' }
        ]}
      />
    </div>
  );
};

export default Premium;
