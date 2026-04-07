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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          building_id: string
          created_at: string
          device_id: string | null
          id: string
          message: string
          resolved_at: string | null
          severity: string
          status: string | null
          type: string
        }
        Insert: {
          building_id: string
          created_at?: string
          device_id?: string | null
          id?: string
          message: string
          resolved_at?: string | null
          severity: string
          status?: string | null
          type: string
        }
        Update: {
          building_id?: string
          created_at?: string
          device_id?: string | null
          id?: string
          message?: string
          resolved_at?: string | null
          severity?: string
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      building_members: {
        Row: {
          building_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          building_id: string
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          building_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "building_members_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      buildings: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          currency: string | null
          electricity_rate: number | null
          id: string
          is_active: boolean | null
          monthly_budget_kwh: number | null
          name: string
          occupants: number | null
          owner_id: string
          peak_hours_end: string | null
          peak_hours_start: string | null
          surface: number | null
          timezone: string | null
          type: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          electricity_rate?: number | null
          id?: string
          is_active?: boolean | null
          monthly_budget_kwh?: number | null
          name: string
          occupants?: number | null
          owner_id: string
          peak_hours_end?: string | null
          peak_hours_start?: string | null
          surface?: number | null
          timezone?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          electricity_rate?: number | null
          id?: string
          is_active?: boolean | null
          monthly_budget_kwh?: number | null
          name?: string
          occupants?: number | null
          owner_id?: string
          peak_hours_end?: string | null
          peak_hours_start?: string | null
          surface?: number | null
          timezone?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      devices: {
        Row: {
          brand: string | null
          building_id: string
          created_at: string
          current_power: number | null
          id: string
          is_on: boolean | null
          last_seen: string | null
          location: string | null
          model: string | null
          name: string
          nominal_power: number | null
          status: string | null
          today_consumption: number | null
          type: string
          updated_at: string
        }
        Insert: {
          brand?: string | null
          building_id: string
          created_at?: string
          current_power?: number | null
          id?: string
          is_on?: boolean | null
          last_seen?: string | null
          location?: string | null
          model?: string | null
          name: string
          nominal_power?: number | null
          status?: string | null
          today_consumption?: number | null
          type: string
          updated_at?: string
        }
        Update: {
          brand?: string | null
          building_id?: string
          created_at?: string
          current_power?: number | null
          id?: string
          is_on?: boolean | null
          last_seen?: string | null
          location?: string | null
          model?: string | null
          name?: string
          nominal_power?: number | null
          status?: string | null
          today_consumption?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "devices_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_readings: {
        Row: {
          current_amp: number | null
          device_id: string
          energy_kwh: number | null
          id: string
          power: number | null
          power_factor: number | null
          recorded_at: string
          voltage: number | null
        }
        Insert: {
          current_amp?: number | null
          device_id: string
          energy_kwh?: number | null
          id?: string
          power?: number | null
          power_factor?: number | null
          recorded_at?: string
          voltage?: number | null
        }
        Update: {
          current_amp?: number | null
          device_id?: string
          energy_kwh?: number | null
          id?: string
          power?: number | null
          power_factor?: number | null
          recorded_at?: string
          voltage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "energy_readings_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          building_id: string | null
          created_at: string
          id: string
          name: string | null
          phone: string | null
          preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          building_id?: string | null
          created_at?: string
          id?: string
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          building_id?: string | null
          created_at?: string
          id?: string
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          building_id: string
          category: string
          created_at: string
          description: string
          device_id: string | null
          estimated_saving_kwh: number | null
          estimated_saving_tnd: number | null
          id: string
          is_applied: boolean | null
          priority: string
          title: string
        }
        Insert: {
          building_id: string
          category: string
          created_at?: string
          description: string
          device_id?: string | null
          estimated_saving_kwh?: number | null
          estimated_saving_tnd?: number | null
          id?: string
          is_applied?: boolean | null
          priority: string
          title: string
        }
        Update: {
          building_id?: string
          category?: string
          created_at?: string
          description?: string
          device_id?: string | null
          estimated_saving_kwh?: number | null
          estimated_saving_tnd?: number | null
          id?: string
          is_applied?: boolean | null
          priority?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      get_user_building: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "manager" | "viewer"
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
      app_role: ["admin", "manager", "viewer"],
    },
  },
} as const
