
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          created_at: string
          name: string
          instagram_id: string
          logo_url: string | null
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          instagram_id: string
          logo_url?: string | null
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          instagram_id?: string
          logo_url?: string | null
          status?: string
        }
        Relationships: []
      }
      metrics: {
        Row: {
          id: string
          created_at: string
          client_id: string
          date: string
          reach: number
          impressions: number
          likes: number
          comments: number
          followers: number
          engagement: number
        }
        Insert: {
          id?: string
          created_at?: string
          client_id: string
          date: string
          reach: number
          impressions: number
          likes: number
          comments: number
          followers: number
          engagement: number
        }
        Update: {
          id?: string
          created_at?: string
          client_id?: string
          date?: string
          reach?: number
          impressions?: number
          likes?: number
          comments?: number
          followers?: number
          engagement?: number
        }
        Relationships: [
          {
            foreignKeyName: "metrics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          role: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id?: string | null
          role: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string | null
          role?: string
          name?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
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
