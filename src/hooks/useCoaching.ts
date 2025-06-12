
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface CoachingSession {
  id: string;
  session_date: string;
  duration_minutes: number;
  status: string;
  session_notes: string | null;
  zoom_link: string | null;
  booking_id: string | null;
}

export const useCoaching = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<CoachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('coaching_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('session_date', { ascending: true });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const bookSession = async (sessionDate: Date) => {
    if (!user) return false;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('coaching_sessions')
        .insert({
          user_id: user.id,
          session_date: sessionDate.toISOString(),
          duration_minutes: 30,
          status: 'scheduled',
          zoom_link: 'https://zoom.us/j/placeholder', // In real app, generate actual Zoom link
        });

      if (error) throw error;

      await fetchSessions();
      
      toast({
        title: "Session Booked!",
        description: "Your coaching session has been scheduled. Check your email for the Zoom link.",
      });

      return true;
    } catch (error) {
      console.error('Error booking session:', error);
      toast({
        title: "Booking Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('coaching_sessions')
        .update({ status: 'cancelled' })
        .eq('id', sessionId);

      if (error) throw error;

      await fetchSessions();
      
      toast({
        title: "Session Cancelled",
        description: "Your coaching session has been cancelled.",
      });
    } catch (error) {
      console.error('Error cancelling session:', error);
      toast({
        title: "Cancellation Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sessions,
    isLoading,
    bookSession,
    cancelSession,
    fetchSessions,
  };
};
