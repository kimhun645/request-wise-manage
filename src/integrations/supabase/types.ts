export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      budget_items: {
        Row: {
          actual_amount: number | null
          budget_amount: number
          category: string
          created_at: string
          department_id: string | null
          description: string
          id: string
          month: number
          status: string
          updated_at: string
          year: number
        }
        Insert: {
          actual_amount?: number | null
          budget_amount: number
          category: string
          created_at?: string
          department_id?: string | null
          description: string
          id?: string
          month: number
          status?: string
          updated_at?: string
          year: number
        }
        Update: {
          actual_amount?: number | null
          budget_amount?: number
          category?: string
          created_at?: string
          department_id?: string | null
          description?: string
          id?: string
          month?: number
          status?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          department: string
          email: string
          employee_id: string
          first_name: string
          hire_date: string
          id: string
          last_name: string
          phone: string | null
          position: string
          salary: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department: string
          email: string
          employee_id: string
          first_name: string
          hire_date: string
          id?: string
          last_name: string
          phone?: string | null
          position: string
          salary?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string
          email?: string
          employee_id?: string
          first_name?: string
          hire_date?: string
          id?: string
          last_name?: string
          phone?: string | null
          position?: string
          salary?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      master_rates: {
        Row: {
          amount: number
          created_at: string
          description: string
          effective_date: string
          expiry_date: string | null
          id: string
          is_active: boolean
          rate_type: string
          unit: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          effective_date: string
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          rate_type: string
          unit: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          effective_date?: string
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          rate_type?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      overtime_items: {
        Row: {
          approved_by: string | null
          created_at: string
          date: string
          description: string | null
          employee_id: string
          hours: number
          id: string
          rate: number
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          date: string
          description?: string | null
          employee_id: string
          hours: number
          id?: string
          rate: number
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          date?: string
          description?: string | null
          employee_id?: string
          hours?: number
          id?: string
          rate?: number
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "overtime_items_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overtime_items_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_expenses: {
        Row: {
          accommodation_cost: number | null
          approved_by: string | null
          created_at: string
          destination: string
          employee_id: string
          id: string
          meal_cost: number | null
          other_costs: number | null
          purpose: string
          receipts: Json | null
          status: string
          total_amount: number
          transportation_cost: number | null
          trip_date: string
          updated_at: string
        }
        Insert: {
          accommodation_cost?: number | null
          approved_by?: string | null
          created_at?: string
          destination: string
          employee_id: string
          id?: string
          meal_cost?: number | null
          other_costs?: number | null
          purpose: string
          receipts?: Json | null
          status?: string
          total_amount: number
          transportation_cost?: number | null
          trip_date: string
          updated_at?: string
        }
        Update: {
          accommodation_cost?: number | null
          approved_by?: string | null
          created_at?: string
          destination?: string
          employee_id?: string
          id?: string
          meal_cost?: number | null
          other_costs?: number | null
          purpose?: string
          receipts?: Json | null
          status?: string
          total_amount?: number
          transportation_cost?: number | null
          trip_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_expenses_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "travel_expenses_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
