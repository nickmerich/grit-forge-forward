
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseGoalStore } from '@/hooks/useSupabaseGoalStore';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';
import BrutalistInput from '@/components/BrutalistInput';
import BrutalistNavigation from '@/components/BrutalistNavigation';
import { GOAL_CATEGORIES, GoalCategory } from '@/types/gryt';

const CreateGoal = () => {
  const navigate = useNavigate();
  const { createGoal } = useSupabaseGoalStore();
  const [formData, setFormData] = useState({
    title: '',
    category: 'health' as GoalCategory,
    description: '',
    whyItMatters: '',
    deadline: '',
    signature: '',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.whyItMatters || !formData.deadline) {
      return;
    }

    setLoading(true);
    try {
      const goal = await createGoal({
        title: formData.title.toUpperCase(),
        category: formData.category,
        description: formData.description,
        whyItMatters: formData.whyItMatters,
        deadline: new Date(formData.deadline),
        signature: formData.signature,
      });

      if (goal) {
        navigate('/contract');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.category;
      case 2: return formData.title.length > 0;
      case 3: return formData.description.length > 0;
      case 4: return formData.whyItMatters.length > 0;
      case 5: return formData.deadline;
      default: return false;
    }
  };

  return (
    <div className="brutalist-container pb-20">
      <div className="brutalist-header">
        <h1 className="brutalist-h1 text-center">CREATE YOUR GOAL</h1>
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step <= currentStep ? 'bg-brutalist-black' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-center font-bold mt-2">STEP {currentStep} OF 5</p>
      </div>

      <div className="brutalist-section">
        <BrutalistCard>
          {currentStep === 1 && (
            <div>
              <h2 className="brutalist-h2 mb-6 text-center">CHOOSE YOUR CATEGORY</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(GOAL_CATEGORIES).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => handleInputChange('category', key)}
                    className={`p-4 border-4 font-bold text-left transition-colors ${
                      formData.category === key
                        ? 'border-brutalist-black bg-brutalist-yellow'
                        : 'border-brutalist-black bg-white hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.emoji}</div>
                    <div className="font-bold">{category.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="brutalist-h2 mb-6 text-center">WHAT'S YOUR GOAL?</h2>
              <div className="mb-4">
                <label className="block font-bold mb-2">GOAL TITLE (BE SPECIFIC)</label>
                <BrutalistInput
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., RUN 5K EVERY MORNING"
                  maxLength={50}
                />
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-bold mb-2">EXAMPLES FOR {GOAL_CATEGORIES[formData.category].label}:</p>
                <ul className="list-disc list-inside">
                  {GOAL_CATEGORIES[formData.category].examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="brutalist-h2 mb-6 text-center">DESCRIBE YOUR PLAN</h2>
              <div className="mb-4">
                <label className="block font-bold mb-2">HOW WILL YOU ACHIEVE THIS?</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your daily actions, when you'll do it, how you'll track progress..."
                  className="w-full p-4 border-4 border-brutalist-black font-bold resize-none h-32"
                  maxLength={500}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="brutalist-h2 mb-6 text-center">WHY DOES THIS MATTER?</h2>
              <div className="mb-4">
                <label className="block font-bold mb-2">YOUR DEEPER MOTIVATION</label>
                <textarea
                  value={formData.whyItMatters}
                  onChange={(e) => handleInputChange('whyItMatters', e.target.value)}
                  placeholder="This goal matters because it will transform my life by..."
                  className="w-full p-4 border-4 border-brutalist-black font-bold resize-none h-32"
                  maxLength={500}
                />
              </div>
              <p className="text-sm font-bold text-gray-600">
                This is what you'll read when motivation gets tough. Make it powerful.
              </p>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h2 className="brutalist-h2 mb-6 text-center">SET YOUR DEADLINE</h2>
              <div className="mb-6">
                <label className="block font-bold mb-2">WHEN WILL YOU COMPLETE THIS?</label>
                <BrutalistInput
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                />
              </div>
              <div className="mb-6">
                <label className="block font-bold mb-2">YOUR SIGNATURE (OPTIONAL)</label>
                <BrutalistInput
                  value={formData.signature}
                  onChange={(e) => handleInputChange('signature', e.target.value)}
                  placeholder="Type your name to sign your commitment"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <BrutalistButton variant="secondary" onClick={prevStep}>
                BACK
              </BrutalistButton>
            )}
            
            {currentStep < 5 ? (
              <BrutalistButton
                onClick={nextStep}
                disabled={!canProceed()}
                className={currentStep === 1 ? 'w-full' : ''}
              >
                NEXT
              </BrutalistButton>
            ) : (
              <BrutalistButton
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                variant="accent"
              >
                {loading ? 'CREATING...' : 'CREATE GOAL'}
              </BrutalistButton>
            )}
          </div>
        </BrutalistCard>
      </div>

      <BrutalistNavigation 
        items={[
          { label: 'DASHBOARD', path: '/', icon: '🏠' },
          { label: 'GOALS', path: '/create-goal', icon: '🎯' },
          { label: 'REWARDS', path: '/rewards', icon: '🏆' },
          { label: 'PROFILE', path: '/profile', icon: '👤' }
        ]}
      />
    </div>
  );
};

export default CreateGoal;
