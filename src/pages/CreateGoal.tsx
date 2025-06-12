
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoalStore } from '@/hooks/useGoalStore';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';
import BrutalistInput from '@/components/BrutalistInput';
import { GOAL_CATEGORIES, GoalCategory } from '@/types/gryt';

const CreateGoal = () => {
  const navigate = useNavigate();
  const { createGoal } = useGoalStore();
  
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | null>(null);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [deadline, setDeadline] = useState('');
  const [signature, setSignature] = useState('');

  const totalSteps = 6;

  const handleCategorySelect = (category: GoalCategory) => {
    setSelectedCategory(category);
    setStep(2);
  };

  const handleCreateGoal = () => {
    if (!selectedCategory || !goalTitle || !goalDescription || !whyItMatters || !deadline || !signature) {
      return;
    }

    const goalData = {
      title: goalTitle.toUpperCase(),
      category: selectedCategory,
      description: goalDescription,
      whyItMatters,
      deadline: new Date(deadline),
      signature
    };

    createGoal(goalData);
    navigate('/contract');
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <BrutalistCard>
              <h2 className="brutalist-h2 mb-4 text-center">CHOOSE YOUR CATEGORY</h2>
              <p className="font-bold text-center mb-6">
                WHAT AREA OF YOUR LIFE NEEDS TRANSFORMATION?
              </p>
            </BrutalistCard>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(GOAL_CATEGORIES).map(([key, category]) => (
                <BrutalistCard 
                  key={key}
                  onClick={() => handleCategorySelect(key as GoalCategory)}
                  className="cursor-pointer text-center hover:bg-brutalist-green hover:text-brutalist-black"
                >
                  <div className="text-4xl mb-2">{category.emoji}</div>
                  <h3 className="brutalist-h2 text-xs mb-2">{category.label}</h3>
                  <div className="text-xs font-bold space-y-1">
                    {category.examples.slice(0, 2).map((example, idx) => (
                      <p key={idx}>• {example}</p>
                    ))}
                  </div>
                </BrutalistCard>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <BrutalistCard>
              <h2 className="brutalist-h2 mb-4 text-center">NAME YOUR GOAL</h2>
              <p className="font-bold text-center mb-6">
                BE SPECIFIC. BE BOLD. BE CLEAR.
              </p>
              
              <BrutalistInput
                value={goalTitle}
                onChange={setGoalTitle}
                placeholder="e.g., RUN 5K EVERY MORNING"
                maxLength={50}
                required
                label="GOAL TITLE"
              />
            </BrutalistCard>

            <div className="flex space-x-4">
              <BrutalistButton variant="secondary" onClick={() => setStep(1)}>
                ← BACK
              </BrutalistButton>
              <BrutalistButton 
                onClick={() => setStep(3)}
                disabled={goalTitle.length < 5}
              >
                CONTINUE →
              </BrutalistButton>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <BrutalistCard>
              <h2 className="brutalist-h2 mb-4 text-center">DESCRIBE YOUR GOAL</h2>
              <p className="font-bold text-center mb-6">
                HOW WILL YOU MEASURE SUCCESS?
              </p>
              
              <BrutalistInput
                value={goalDescription}
                onChange={setGoalDescription}
                placeholder="e.g., Run for 30 minutes every morning before 8 AM"
                maxLength={200}
                required
                label="DETAILED DESCRIPTION"
              />
            </BrutalistCard>

            <div className="flex space-x-4">
              <BrutalistButton variant="secondary" onClick={() => setStep(2)}>
                ← BACK
              </BrutalistButton>
              <BrutalistButton 
                onClick={() => setStep(4)}
                disabled={goalDescription.length < 20}
              >
                CONTINUE →
              </BrutalistButton>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <BrutalistCard glow>
              <h2 className="brutalist-h2 mb-4 text-center">WHY DOES THIS MATTER?</h2>
              <p className="font-bold text-center mb-6">
                THIS IS YOUR FUEL. DIG DEEP.
                <br />
                MINIMUM 100 CHARACTERS.
              </p>
              
              <textarea
                value={whyItMatters}
                onChange={(e) => setWhyItMatters(e.target.value)}
                placeholder="Write about how achieving this goal will transform your life, your confidence, your future..."
                maxLength={500}
                minLength={100}
                required
                rows={6}
                className="brutalist-input focus-brutalist resize-none"
              />
              <p className="text-xs font-bold text-right mt-2">
                {whyItMatters.length}/500 (minimum 100)
              </p>
            </BrutalistCard>

            <div className="flex space-x-4">
              <BrutalistButton variant="secondary" onClick={() => setStep(3)}>
                ← BACK
              </BrutalistButton>
              <BrutalistButton 
                onClick={() => setStep(5)}
                disabled={whyItMatters.length < 100}
              >
                CONTINUE →
              </BrutalistButton>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <BrutalistCard>
              <h2 className="brutalist-h2 mb-4 text-center">SET YOUR DEADLINE</h2>
              <p className="font-bold text-center mb-6">
                DREAMS WITHOUT DEADLINES ARE JUST WISHES.
              </p>
              
              <div className="space-y-4">
                <label className="brutalist-h2 text-sm block">
                  TARGET COMPLETION DATE *
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  required
                  className="brutalist-input focus-brutalist"
                />
              </div>
              
              {deadline && (
                <p className="text-center font-bold mt-4 text-brutalist-green">
                  {Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} DAYS TO TRANSFORM
                </p>
              )}
            </BrutalistCard>

            <div className="flex space-x-4">
              <BrutalistButton variant="secondary" onClick={() => setStep(4)}>
                ← BACK
              </BrutalistButton>
              <BrutalistButton 
                onClick={() => setStep(6)}
                disabled={!deadline}
              >
                CONTINUE →
              </BrutalistButton>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <BrutalistCard glow>
              <h2 className="brutalist-h2 mb-4 text-center">SIGN YOUR CONTRACT</h2>
              <p className="font-bold text-center mb-6">
                THIS IS YOUR COMMITMENT TO YOURSELF.
                <br />
                SIGN YOUR NAME TO MAKE IT OFFICIAL.
              </p>
              
              <BrutalistInput
                value={signature}
                onChange={setSignature}
                placeholder="Type your full name"
                required
                label="YOUR SIGNATURE"
              />
              
              {signature && (
                <div className="mt-6 p-4 border-4 border-brutalist-black bg-brutalist-white">
                  <p className="font-bold text-center mb-4">
                    I, <span className="brutalist-h2">{signature}</span>, COMMIT TO:
                  </p>
                  <p className="font-bold text-center mb-2">{goalTitle}</p>
                  <p className="text-center mb-4">{goalDescription}</p>
                  <p className="text-center font-bold">
                    DEADLINE: {new Date(deadline).toLocaleDateString()}
                  </p>
                </div>
              )}
            </BrutalistCard>

            <div className="flex space-x-4">
              <BrutalistButton variant="secondary" onClick={() => setStep(5)}>
                ← BACK
              </BrutalistButton>
              <BrutalistButton 
                variant="accent"
                onClick={handleCreateGoal}
                disabled={!signature}
              >
                🔥 COMMIT TO GRYT
              </BrutalistButton>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="brutalist-container pb-20">
      {/* Header */}
      <div className="brutalist-header">
        <h1 className="brutalist-h1 text-center">CREATE GOAL</h1>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">STEP {step} OF {totalSteps}</span>
            <span className="font-bold">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-brutalist-white border-2 border-brutalist-black">
            <div 
              className="h-full bg-brutalist-green transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="brutalist-section">
        {renderStepContent()}
      </div>

      {/* Back to Dashboard */}
      {step === 1 && (
        <div className="brutalist-section">
          <BrutalistButton variant="secondary" onClick={() => navigate('/')}>
            ← BACK TO DASHBOARD
          </BrutalistButton>
        </div>
      )}
    </div>
  );
};

export default CreateGoal;
