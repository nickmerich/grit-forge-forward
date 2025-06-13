
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseGoalStore } from '@/hooks/useSupabaseGoalStore';
import { useToast } from '@/hooks/use-toast';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';
import BrutalistNavigation from '@/components/BrutalistNavigation';

interface Reflection {
  id?: string;
  mood_score: number;
  reflection_text: string;
  gratitude_note: string;
  tomorrow_intention: string;
  achievements_today: string[];
  challenges_faced: string;
  lessons_learned: string;
}

const Reflect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentGoal } = useSupabaseGoalStore();
  const { toast } = useToast();
  
  const [reflection, setReflection] = useState<Reflection>({
    mood_score: 3,
    reflection_text: '',
    gratitude_note: '',
    tomorrow_intention: '',
    achievements_today: [],
    challenges_faced: '',
    lessons_learned: ''
  });
  
  const [newAchievement, setNewAchievement] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasReflectedToday, setHasReflectedToday] = useState(false);

  useEffect(() => {
    checkTodaysReflection();
  }, [user, currentGoal]);

  const checkTodaysReflection = async () => {
    if (!user || !currentGoal) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', user.id)
        .eq('goal_id', currentGoal.id)
        .eq('date', today)
        .single();

      if (data) {
        setReflection({
          id: data.id,
          mood_score: data.mood_score || 3,
          reflection_text: data.reflection_text || '',
          gratitude_note: data.gratitude_note || '',
          tomorrow_intention: data.tomorrow_intention || '',
          achievements_today: data.achievements_today || [],
          challenges_faced: data.challenges_faced || '',
          lessons_learned: data.lessons_learned || ''
        });
        setHasReflectedToday(true);
      }
    } catch (error) {
      console.log('No reflection found for today, starting fresh');
    }
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setReflection(prev => ({
        ...prev,
        achievements_today: [...prev.achievements_today, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setReflection(prev => ({
      ...prev,
      achievements_today: prev.achievements_today.filter((_, i) => i !== index)
    }));
  };

  const saveReflection = async () => {
    if (!user || !currentGoal) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const reflectionData = {
        user_id: user.id,
        goal_id: currentGoal.id,
        date: today,
        ...reflection
      };

      if (reflection.id) {
        // Update existing reflection
        const { error } = await supabase
          .from('reflections')
          .update(reflectionData)
          .eq('id', reflection.id);
        
        if (error) throw error;
      } else {
        // Create new reflection
        const { data, error } = await supabase
          .from('reflections')
          .insert(reflectionData)
          .select()
          .single();
        
        if (error) throw error;
        
        if (data) {
          setReflection(prev => ({ ...prev, id: data.id }));
        }
      }

      setHasReflectedToday(true);
      toast({
        title: "Reflection Saved!",
        description: "Your daily reflection has been recorded.",
      });
    } catch (error) {
      console.error('Error saving reflection:', error);
      toast({
        title: "Error",
        description: "Failed to save reflection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const moodEmojis = ['😢', '😕', '😐', '😊', '😁'];
  const moodLabels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];

  return (
    <div className="brutalist-container pb-20">
      <div className="brutalist-header">
        <h1 className="brutalist-h1 text-center">DAILY REFLECTION</h1>
        <p className="text-center font-bold mt-2">
          {hasReflectedToday ? 'REFLECTION UPDATED' : 'REFLECT ON YOUR JOURNEY'}
        </p>
      </div>

      <div className="brutalist-section space-y-6">
        {/* Mood Tracking */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">😊 HOW ARE YOU FEELING?</h2>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {moodEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => setReflection(prev => ({ ...prev, mood_score: index + 1 }))}
                className={`p-4 border-4 border-brutalist-black text-center transition-colors ${
                  reflection.mood_score === index + 1 
                    ? 'bg-brutalist-green' 
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="text-xs font-bold">{moodLabels[index]}</div>
              </button>
            ))}
          </div>
        </BrutalistCard>

        {/* Main Reflection */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">💭 TODAY'S REFLECTION</h2>
          <textarea
            value={reflection.reflection_text}
            onChange={(e) => setReflection(prev => ({ ...prev, reflection_text: e.target.value }))}
            placeholder="How did today go? What did you learn about yourself? What challenges did you face?"
            className="w-full p-4 border-4 border-brutalist-black font-bold resize-none h-32 mb-4"
            maxLength={1000}
          />
          <div className="text-xs font-bold text-right text-gray-600">
            {reflection.reflection_text.length}/1000
          </div>
        </BrutalistCard>

        {/* Achievements Today */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">🎯 WINS FROM TODAY</h2>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              placeholder="Add a win from today..."
              className="flex-1 p-3 border-4 border-brutalist-black font-bold"
              maxLength={100}
              onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
            />
            <BrutalistButton onClick={addAchievement} disabled={!newAchievement.trim()}>
              ADD
            </BrutalistButton>
          </div>
          
          {reflection.achievements_today.length > 0 && (
            <div className="space-y-2">
              {reflection.achievements_today.map((achievement, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border-2 border-brutalist-black bg-brutalist-green"
                >
                  <span className="font-bold">✓ {achievement}</span>
                  <button
                    onClick={() => removeAchievement(index)}
                    className="font-bold text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </BrutalistCard>

        {/* Gratitude */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">🙏 GRATITUDE</h2>
          <textarea
            value={reflection.gratitude_note}
            onChange={(e) => setReflection(prev => ({ ...prev, gratitude_note: e.target.value }))}
            placeholder="What are you grateful for today?"
            className="w-full p-4 border-4 border-brutalist-black font-bold resize-none h-24"
            maxLength={500}
          />
        </BrutalistCard>

        {/* Challenges */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">⚡ CHALLENGES FACED</h2>
          <textarea
            value={reflection.challenges_faced}
            onChange={(e) => setReflection(prev => ({ ...prev, challenges_faced: e.target.value }))}
            placeholder="What obstacles did you encounter? How did you handle them?"
            className="w-full p-4 border-4 border-brutalist-black font-bold resize-none h-24"
            maxLength={500}
          />
        </BrutalistCard>

        {/* Lessons Learned */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">📚 LESSONS LEARNED</h2>
          <textarea
            value={reflection.lessons_learned}
            onChange={(e) => setReflection(prev => ({ ...prev, lessons_learned: e.target.value }))}
            placeholder="What did you learn about yourself, your goal, or your process today?"
            className="w-full p-4 border-4 border-brutalist-black font-bold resize-none h-24"
            maxLength={500}
          />
        </BrutalistCard>

        {/* Tomorrow's Intention */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">🌅 TOMORROW'S INTENTION</h2>
          <textarea
            value={reflection.tomorrow_intention}
            onChange={(e) => setReflection(prev => ({ ...prev, tomorrow_intention: e.target.value }))}
            placeholder="What's your intention for tomorrow? How will you show up?"
            className="w-full p-4 border-4 border-brutalist-black font-bold resize-none h-24"
            maxLength={500}
          />
        </BrutalistCard>

        {/* Save Button */}
        <BrutalistButton
          onClick={saveReflection}
          disabled={loading}
          className="w-full"
          variant="accent"
        >
          {loading ? 'SAVING...' : hasReflectedToday ? 'UPDATE REFLECTION' : 'SAVE REFLECTION'}
        </BrutalistButton>
      </div>

      <BrutalistNavigation 
        items={[
          { label: 'DASHBOARD', path: '/', icon: '🏠' },
          { label: 'ANALYTICS', path: '/analytics', icon: '📊' },
          { label: 'REFLECT', path: '/reflect', icon: '📝' },
          { label: 'PROFILE', path: '/profile', icon: '👤' }
        ]}
      />
    </div>
  );
};

export default Reflect;
