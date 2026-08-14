export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      progress: {
        Row: { user_id: string; state: Json; created_at: string; updated_at: string }
        Insert: { user_id: string; state: Json; created_at?: string; updated_at?: string }
        Update: { user_id?: string; state?: Json; created_at?: string; updated_at?: string }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
