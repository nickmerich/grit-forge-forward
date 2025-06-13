
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseGoalStore } from '@/hooks/useSupabaseGoalStore';
import { useAchievements } from '@/hooks/useAchievements';
import { useNotifications } from '@/hooks/useNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';
import BrutalistInput from '@/components/BrutalistInput';
import BrutalistNavigation from '@/components/BrutalistNavigation';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile, growthPoints } = useSupabaseGoalStore();
  const { achievements } = useAchievements();
  const { notifications, unreadCount } = useNotifications();
  const { toast } = useToast();

  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    username: '',
    timezone: 'UTC',
    daily_reminder_time: '09:00'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        timezone: profile.timezone || 'UTC',
        daily_reminder_time: profile.daily_reminder_time || '09:00'
      });
    }
  }, [profile]);

  const updateProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated!",
        description: "Your profile has been successfully updated.",
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    if (!user) return;

    try {
      // Fetch all user data
      const [goalsData, reflectionsData, achievementsData] = await Promise.all([
        supabase.from('goals').select('*').eq('user_id', user.id),
        supabase.from('reflections').select('*').eq('user_id', user.id),
        supabase.from('achievements').select('*').eq('user_id', user.id)
      ]);

      const exportData = {
        profile: profile,
        goals: goalsData.data || [],
        reflections: reflectionsData.data || [],
        achievements: achievementsData.data || [],
        growth_points: growthPoints,
        exported_at: new Date().toISOString()
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gryt-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported!",
        description: "Your GRYT data has been downloaded.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'Unknown';

  return (
    <div className="brutalist-container pb-20">
      <div className="brutalist-header">
        <h1 className="brutalist-h1 text-center">PROFILE</h1>
        <p className="text-center font-bold mt-2">YOUR GRYT JOURNEY</p>
      </div>

      <div className="brutalist-section space-y-6">
        {/* Profile Info */}
        <BrutalistCard>
          <div className="flex justify-between items-start mb-4">
            <h2 className="brutalist-h2">👤 PROFILE INFO</h2>
            <BrutalistButton
              onClick={() => setEditMode(!editMode)}
              variant="secondary"
              className="text-sm"
            >
              {editMode ? 'CANCEL' : 'EDIT'}
            </BrutalistButton>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <BrutalistInput
                label="FULL NAME"
                value={profileData.full_name}
                onChange={(value) => setProfileData(prev => ({ ...prev, full_name: value }))}
                placeholder="Enter your full name"
              />
              
              <BrutalistInput
                label="USERNAME"
                value={profileData.username}
                onChange={(value) => setProfileData(prev => ({ ...prev, username: value }))}
                placeholder="Choose a username"
              />

              <div>
                <label className="block font-bold mb-2">TIMEZONE</label>
                <select
                  value={profileData.timezone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full p-3 border-4 border-brutalist-black font-bold"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-2">DAILY REMINDER TIME</label>
                <input
                  type="time"
                  value={profileData.daily_reminder_time}
                  onChange={(e) => setProfileData(prev => ({ ...prev, daily_reminder_time: e.target.value }))}
                  className="w-full p-3 border-4 border-brutalist-black font-bold"
                />
              </div>

              <BrutalistButton
                onClick={updateProfile}
                disabled={loading}
                className="w-full"
                variant="accent"
              >
                {loading ? 'SAVING...' : 'SAVE CHANGES'}
              </BrutalistButton>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <span className="font-bold">Name: </span>
                <span>{profileData.full_name || 'Not set'}</span>
              </div>
              <div>
                <span className="font-bold">Username: </span>
                <span>{profileData.username || 'Not set'}</span>
              </div>
              <div>
                <span className="font-bold">Email: </span>
                <span>{user?.email}</span>
              </div>
              <div>
                <span className="font-bold">Member Since: </span>
                <span>{memberSince}</span>
              </div>
              <div>
                <span className="font-bold">Timezone: </span>
                <span>{profileData.timezone}</span>
              </div>
            </div>
          )}
        </BrutalistCard>

        {/* Stats */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">📊 YOUR STATS</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border-2 border-brutalist-black bg-brutalist-green">
              <div className="text-2xl font-bold">{growthPoints?.total || 0}</div>
              <div className="font-bold text-sm">TOTAL POINTS</div>
            </div>
            <div className="text-center p-4 border-2 border-brutalist-black bg-yellow-200">
              <div className="text-2xl font-bold">{growthPoints?.level || 1}</div>
              <div className="font-bold text-sm">CURRENT LEVEL</div>
            </div>
            <div className="text-center p-4 border-2 border-brutalist-black bg-blue-200">
              <div className="text-2xl font-bold">{achievements.length}</div>
              <div className="font-bold text-sm">ACHIEVEMENTS</div>
            </div>
            <div className="text-center p-4 border-2 border-brutalist-black bg-purple-200">
              <div className="text-2xl font-bold">{unreadCount}</div>
              <div className="font-bold text-sm">NOTIFICATIONS</div>
            </div>
          </div>
        </BrutalistCard>

        {/* Recent Achievements */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">🏆 RECENT ACHIEVEMENTS</h2>
          {achievements.length > 0 ? (
            <div className="space-y-2">
              {achievements.slice(0, 3).map((achievement) => (
                <div 
                  key={achievement.id}
                  className="flex items-center space-x-3 p-3 border-2 border-brutalist-black bg-brutalist-green"
                >
                  <span className="text-xl">{achievement.icon || '🏆'}</span>
                  <div className="flex-1">
                    <div className="font-bold">{achievement.title}</div>
                    <div className="text-sm">+{achievement.points_earned} points</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">🎯</div>
              <p className="font-bold">No achievements yet. Keep pushing!</p>
            </div>
          )}
        </BrutalistCard>

        {/* Data Management */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">💾 DATA MANAGEMENT</h2>
          <div className="space-y-3">
            <BrutalistButton
              onClick={exportData}
              variant="secondary"
              className="w-full"
            >
              📤 EXPORT MY DATA
            </BrutalistButton>
            <p className="text-sm text-gray-600 font-bold">
              Download all your GRYT data including goals, reflections, and achievements.
            </p>
          </div>
        </BrutalistCard>

        {/* Sign Out */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">🔒 ACCOUNT</h2>
          <BrutalistButton
            onClick={handleSignOut}
            variant="secondary"
            className="w-full border-red-500 text-red-600 hover:bg-red-50"
          >
            SIGN OUT
          </BrutalistButton>
        </BrutalistCard>
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

export default Profile;
