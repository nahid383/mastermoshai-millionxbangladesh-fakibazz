export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      answer_evaluations: {
        Row: {
          ai_feedback: Json | null
          created_at: string
          id: string
          max_score: number | null
          question: string
          score: number | null
          student_answer: string
          subject_id: string
          topic: string | null
          user_id: string
        }
        Insert: {
          ai_feedback?: Json | null
          created_at?: string
          id?: string
          max_score?: number | null
          question: string
          score?: number | null
          student_answer: string
          subject_id: string
          topic?: string | null
          user_id: string
        }
        Update: {
          ai_feedback?: Json | null
          created_at?: string
          id?: string
          max_score?: number | null
          question?: string
          score?: number | null
          student_answer?: string
          subject_id?: string
          topic?: string | null
          user_id?: string
        }
        Relationships: []
      }
      doubt_sessions: {
        Row: {
          created_at: string
          id: string
          is_resolved: boolean | null
          messages: Json | null
          subject_id: string | null
          topic: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_resolved?: boolean | null
          messages?: Json | null
          subject_id?: string | null
          topic?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_resolved?: boolean | null
          messages?: Json | null
          subject_id?: string | null
          topic?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      guardian_links: {
        Row: {
          approved_at: string | null
          created_at: string
          guardian_id: string
          id: string
          status: string
          student_id: string
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          guardian_id: string
          id?: string
          status?: string
          student_id: string
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          guardian_id?: string
          id?: string
          status?: string
          student_id?: string
        }
        Relationships: []
      }
      mental_support_sessions: {
        Row: {
          created_at: string
          id: string
          messages: Json | null
          mood_level: number | null
          stress_level: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json | null
          mood_level?: number | null
          stress_level?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json | null
          mood_level?: number | null
          stress_level?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          admission_year: string | null
          avatar_url: string | null
          badges: Json | null
          correct_answers: number | null
          created_at: string
          daily_progress: number | null
          exam_date: string | null
          id: string
          institution: string | null
          level: string | null
          location: string | null
          medium: string | null
          name: string | null
          questions_answered: number | null
          streak: number | null
          strong_topics: string[] | null
          target_department: string | null
          target_university: string | null
          total_points: number | null
          updated_at: string
          user_id: string
          weak_topics: string[] | null
        }
        Insert: {
          admission_year?: string | null
          avatar_url?: string | null
          badges?: Json | null
          correct_answers?: number | null
          created_at?: string
          daily_progress?: number | null
          exam_date?: string | null
          id?: string
          institution?: string | null
          level?: string | null
          location?: string | null
          medium?: string | null
          name?: string | null
          questions_answered?: number | null
          streak?: number | null
          strong_topics?: string[] | null
          target_department?: string | null
          target_university?: string | null
          total_points?: number | null
          updated_at?: string
          user_id: string
          weak_topics?: string[] | null
        }
        Update: {
          admission_year?: string | null
          avatar_url?: string | null
          badges?: Json | null
          correct_answers?: number | null
          created_at?: string
          daily_progress?: number | null
          exam_date?: string | null
          id?: string
          institution?: string | null
          level?: string | null
          location?: string | null
          medium?: string | null
          name?: string | null
          questions_answered?: number | null
          streak?: number | null
          strong_topics?: string[] | null
          target_department?: string | null
          target_university?: string | null
          total_points?: number | null
          updated_at?: string
          user_id?: string
          weak_topics?: string[] | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: number
          created_at: string
          difficulty: string | null
          explanation: string | null
          explanation_bangla: string | null
          id: string
          options: Json
          question: string
          question_bangla: string | null
          subject_id: string
          topic: string | null
          updated_at: string
        }
        Insert: {
          correct_answer: number
          created_at?: string
          difficulty?: string | null
          explanation?: string | null
          explanation_bangla?: string | null
          id?: string
          options?: Json
          question: string
          question_bangla?: string | null
          subject_id: string
          topic?: string | null
          updated_at?: string
        }
        Update: {
          correct_answer?: number
          created_at?: string
          difficulty?: string | null
          explanation?: string | null
          explanation_bangla?: string | null
          id?: string
          options?: Json
          question?: string
          question_bangla?: string | null
          subject_id?: string
          topic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json | null
          created_at: string
          difficulty: string
          id: string
          is_timed: boolean | null
          score: number
          subject_id: string
          time_taken: number | null
          topic: string
          total_questions: number
          user_id: string
        }
        Insert: {
          answers?: Json | null
          created_at?: string
          difficulty?: string
          id?: string
          is_timed?: boolean | null
          score?: number
          subject_id: string
          time_taken?: number | null
          topic: string
          total_questions: number
          user_id: string
        }
        Update: {
          answers?: Json | null
          created_at?: string
          difficulty?: string
          id?: string
          is_timed?: boolean | null
          score?: number
          subject_id?: string
          time_taken?: number | null
          topic?: string
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      study_plans: {
        Row: {
          created_at: string
          exam_date: string | null
          id: string
          plan_data: Json
          target_university: string | null
          updated_at: string
          user_id: string
          weekly_hours: number | null
        }
        Insert: {
          created_at?: string
          exam_date?: string | null
          id?: string
          plan_data?: Json
          target_university?: string | null
          updated_at?: string
          user_id: string
          weekly_hours?: number | null
        }
        Update: {
          created_at?: string
          exam_date?: string | null
          id?: string
          plan_data?: Json
          target_university?: string | null
          updated_at?: string
          user_id?: string
          weekly_hours?: number | null
        }
        Relationships: []
      }
      university_prep: {
        Row: {
          created_at: string
          id: string
          mock_tests_completed: number | null
          progress: Json | null
          target_unit: string | null
          university: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mock_tests_completed?: number | null
          progress?: Json | null
          target_unit?: string | null
          university: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mock_tests_completed?: number | null
          progress?: Json | null
          target_unit?: string | null
          university?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "guardian" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "guardian", "admin"],
    },
  },
} as const
