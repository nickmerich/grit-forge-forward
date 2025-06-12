
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Subscription {
  id: string;
  status: string;
  plan_type: string;
  current_period_start: string | null;
  current_period_end: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isPremium = subscription?.plan_type === 'premium' && subscription?.status === 'active';

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const upgradeToPremium = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would integrate with Stripe
      // For now, we'll simulate the upgrade
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          status: 'active',
          plan_type: 'premium',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });

      if (error) throw error;

      // Update profile subscription tier
      await supabase
        .from('profiles')
        .update({ subscription_tier: 'premium' })
        .eq('id', user.id);

      await fetchSubscription();
      
      toast({
        title: "Welcome to GRYT Pro!",
        description: "You now have access to all premium features.",
      });
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      toast({
        title: "Upgrade Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    subscription,
    isPremium,
    isLoading,
    upgradeToPremium,
    fetchSubscription,
  };
};
