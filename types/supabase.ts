export interface Database {
  public: {
    Tables: {
      essays: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          content: string;
        };
        Update: Partial<{
          title: string;
          content: string;
        }>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
