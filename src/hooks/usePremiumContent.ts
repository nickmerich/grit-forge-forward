
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface PremiumContent {
  id: string;
  title: string;
  description: string;
  content_type: string;
  price: number;
  file_url: string | null;
  preview_content: string | null;
  is_active: boolean;
}

interface ContentPurchase {
  id: string;
  content_id: string;
  purchase_date: string;
  access_expires_at: string | null;
}

export const usePremiumContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<PremiumContent[]>([]);
  const [purchases, setPurchases] = useState<ContentPurchase[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchContent();
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('premium_content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const fetchPurchases = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('content_purchases')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const purchaseContent = async (contentId: string, price: number) => {
    if (!user) return false;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('content_purchases')
        .insert({
          user_id: user.id,
          content_id: contentId,
          content_type: 'digital',
          price_paid: price,
        });

      if (error) throw error;

      await fetchPurchases();
      
      toast({
        title: "Purchase Successful!",
        description: "You now have access to this content.",
      });

      return true;
    } catch (error) {
      console.error('Error purchasing content:', error);
      toast({
        title: "Purchase Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const hasPurchased = (contentId: string) => {
    return purchases.some(p => p.content_id === contentId);
  };

  return {
    content,
    purchases,
    isLoading,
    purchaseContent,
    hasPurchased,
    fetchContent,
    fetchPurchases,
  };
};
