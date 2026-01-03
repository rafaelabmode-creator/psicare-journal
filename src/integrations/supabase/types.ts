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
      patient_status_history: {
        Row: {
          changed_at: string
          created_by: string
          id: string
          notes: string | null
          patient_id: string
          reason: string
          status: Database["public"]["Enums"]["treatment_status"]
        }
        Insert: {
          changed_at?: string
          created_by: string
          id?: string
          notes?: string | null
          patient_id: string
          reason: string
          status: Database["public"]["Enums"]["treatment_status"]
        }
        Update: {
          changed_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          patient_id?: string
          reason?: string
          status?: Database["public"]["Enums"]["treatment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "patient_status_history_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          birth_date: string
          city: string | null
          cpf: string
          created_at: string
          current_status: Database["public"]["Enums"]["treatment_status"]
          email: string | null
          guardian_cpf: string | null
          guardian_name: string | null
          guardian_phone: string | null
          guardian_relationship: string | null
          id: string
          is_minor: boolean
          name: string
          phone: string | null
          profession: string | null
          state: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          birth_date: string
          city?: string | null
          cpf: string
          created_at?: string
          current_status?: Database["public"]["Enums"]["treatment_status"]
          email?: string | null
          guardian_cpf?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          guardian_relationship?: string | null
          id?: string
          is_minor?: boolean
          name: string
          phone?: string | null
          profession?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string
          city?: string | null
          cpf?: string
          created_at?: string
          current_status?: Database["public"]["Enums"]["treatment_status"]
          email?: string | null
          guardian_cpf?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          guardian_relationship?: string | null
          id?: string
          is_minor?: boolean
          name?: string
          phone?: string | null
          profession?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          crp: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          crp: string
          email?: string | null
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          crp?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      session_documents: {
        Row: {
          created_at: string
          description: string | null
          document_type: string
          file_path: string | null
          id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_type: string
          file_path?: string | null
          id?: string
          session_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_type?: string
          file_path?: string | null
          id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_documents_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          approach: Database["public"]["Enums"]["therapy_approach"] | null
          cid_diagnosis: string[]
          clinical_hypotheses: string | null
          clinical_observations: string | null
          complaint_history: string | null
          created_at: string
          date: string
          dsm_diagnosis: string[]
          duration_minutes: number
          eating: string | null
          id: string
          interventions: string | null
          main_complaint: string | null
          medication_new: string | null
          medication_status: string | null
          modality: Database["public"]["Enums"]["session_modality"]
          mood: string[]
          notes: string | null
          observed_progress: string | null
          patient_id: string
          referral_needed: boolean
          referral_reason: string | null
          referral_to: string | null
          relevant_history: string | null
          session_type: Database["public"]["Enums"]["session_type"]
          sleep_pattern: string | null
          techniques: string[]
          therapeutic_goals: string | null
          time: string
          topics: string[]
          treatment_plan: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          approach?: Database["public"]["Enums"]["therapy_approach"] | null
          cid_diagnosis?: string[]
          clinical_hypotheses?: string | null
          clinical_observations?: string | null
          complaint_history?: string | null
          created_at?: string
          date: string
          dsm_diagnosis?: string[]
          duration_minutes?: number
          eating?: string | null
          id?: string
          interventions?: string | null
          main_complaint?: string | null
          medication_new?: string | null
          medication_status?: string | null
          modality: Database["public"]["Enums"]["session_modality"]
          mood?: string[]
          notes?: string | null
          observed_progress?: string | null
          patient_id: string
          referral_needed?: boolean
          referral_reason?: string | null
          referral_to?: string | null
          relevant_history?: string | null
          session_type?: Database["public"]["Enums"]["session_type"]
          sleep_pattern?: string | null
          techniques?: string[]
          therapeutic_goals?: string | null
          time: string
          topics?: string[]
          treatment_plan?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          approach?: Database["public"]["Enums"]["therapy_approach"] | null
          cid_diagnosis?: string[]
          clinical_hypotheses?: string | null
          clinical_observations?: string | null
          complaint_history?: string | null
          created_at?: string
          date?: string
          dsm_diagnosis?: string[]
          duration_minutes?: number
          eating?: string | null
          id?: string
          interventions?: string | null
          main_complaint?: string | null
          medication_new?: string | null
          medication_status?: string | null
          modality?: Database["public"]["Enums"]["session_modality"]
          mood?: string[]
          notes?: string | null
          observed_progress?: string | null
          patient_id?: string
          referral_needed?: boolean
          referral_reason?: string | null
          referral_to?: string | null
          relevant_history?: string | null
          session_type?: Database["public"]["Enums"]["session_type"]
          sleep_pattern?: string | null
          techniques?: string[]
          therapeutic_goals?: string | null
          time?: string
          topics?: string[]
          treatment_plan?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      session_modality: "presencial" | "online"
      session_type: "anamnese" | "regular" | "encerramento"
      therapy_approach:
        | "cognitiva"
        | "psicodinamica"
        | "humanista"
        | "analise-comportamento"
      treatment_status:
        | "ativo"
        | "alta"
        | "abandono"
        | "encaminhado"
        | "suspenso"
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
      session_modality: ["presencial", "online"],
      session_type: ["anamnese", "regular", "encerramento"],
      therapy_approach: [
        "cognitiva",
        "psicodinamica",
        "humanista",
        "analise-comportamento",
      ],
      treatment_status: [
        "ativo",
        "alta",
        "abandono",
        "encaminhado",
        "suspenso",
      ],
    },
  },
} as const
