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

      folders: {
        Row: {
          id: string;
          user_id: string;
          title: string;
        };
        Insert: {
          user_id: string;
          title: string;
        };
        Update: Partial<{
          title: string;
        }>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
