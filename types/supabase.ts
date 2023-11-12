export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      shortlinks: {
        Row: {
          created_at: string;
          expire: string | null;
          id: string;
          link: string;
          short: string;
        };
        Insert: {
          created_at?: string;
          expire?: string | null;
          id?: string;
          link?: string;
          short?: string;
        };
        Update: {
          created_at?: string;
          expire?: string | null;
          id?: string;
          link?: string;
          short?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
