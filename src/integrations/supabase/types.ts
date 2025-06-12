export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      daily_coaching: {
        Row: {
          action_step: string
          affirmation: string
          completed: boolean | null
          created_at: string | null
          date: string | null
          goal_id: string
          id: string
          mood_score: number | null
          reflection: string | null
          user_id: string
        }
        Insert: {
          action_step: string
          affirmation: string
          completed?: boolean | null
          created_at?: string | null
          date?: string | null
          goal_id: string
          id?: string
          mood_score?: number | null
          reflection?: string | null
          user_id: string
        }
        Update: {
          action_step?: string
          affirmation?: string
          completed?: boolean | null
          created_at?: string | null
          date?: string | null
          goal_id?: string
          id?: string
          mood_score?: number | null
          reflection?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_coaching_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_coaching_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string
          completed_days: number | null
          created_at: string | null
          daily_streak: number | null
          deadline: string
          description: string
          id: string
          is_active: boolean | null
          progress: number | null
          signature: string | null
          title: string
          total_days: number
          updated_at: string | null
          user_id: string
          why_it_matters: string
        }
        Insert: {
          category: string
          completed_days?: number | null
          created_at?: string | null
          daily_streak?: number | null
          deadline: string
          description: string
          id?: string
          is_active?: boolean | null
          progress?: number | null
          signature?: string | null
          title: string
          total_days: number
          updated_at?: string | null
          user_id: string
          why_it_matters: string
        }
        Update: {
          category?: string
          completed_days?: number | null
          created_at?: string | null
          daily_streak?: number | null
          deadline?: string
          description?: string
          id?: string
          is_active?: boolean | null
          progress?: number | null
          signature?: string | null
          title?: string
          total_days?: number
          updated_at?: string | null
          user_id?: string
          why_it_matters?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      growth_points: {
        Row: {
          current_level: number | null
          daily_bonus: number | null
          earned_points: number | null
          id: string
          spent_points: number | null
          streak_bonus: number | null
          total_points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          current_level?: number | null
          daily_bonus?: number | null
          earned_points?: number | null
          id?: string
          spent_points?: number | null
          streak_bonus?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          current_level?: number | null
          daily_bonus?: number | null
          earned_points?: number | null
          id?: string
          spent_points?: number | null
          streak_bonus?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "growth_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          timezone: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          timezone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          timezone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      progress_logs: {
        Row: {
          completed: boolean | null
          created_at: string | null
          date: string | null
          goal_id: string
          id: string
          notes: string | null
          photo_url: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          date?: string | null
          goal_id: string
          id?: string
          notes?: string | null
          photo_url?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          date?: string | null
          goal_id?: string
          id?: string
          notes?: string | null
          photo_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_logs_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      redemptions: {
        Row: {
          id: string
          points_spent: number
          redeemed_at: string | null
          reward_id: string
          status: string | null
          tracking_code: string | null
          user_id: string
        }
        Insert: {
          id?: string
          points_spent: number
          redeemed_at?: string | null
          reward_id: string
          status?: string | null
          tracking_code?: string | null
          user_id: string
        }
        Update: {
          id?: string
          points_spent?: number
          redeemed_at?: string | null
          reward_id?: string
          status?: string | null
          tracking_code?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          available: boolean | null
          brand_partner: string | null
          category: string
          created_at: string | null
          description: string
          external_id: string | null
          id: string
          image_url: string | null
          points_cost: number
          title: string
        }
        Insert: {
          available?: boolean | null
          brand_partner?: string | null
          category: string
          created_at?: string | null
          description: string
          external_id?: string | null
          id?: string
          image_url?: string | null
          points_cost: number
          title: string
        }
        Update: {
          available?: boolean | null
          brand_partner?: string | null
          category?: string
          created_at?: string | null
          description?: string
          external_id?: string | null
          id?: string
          image_url?: string | null
          points_cost?: number
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
