export interface UserProfile {
  id: string;
  username: string;
  email: string;
}

export type Essays = {
  id?: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      essays: {
        Row: Essays;
        Insert: Omit<Essays, "id" | "created_at">;
        Update: Partial<Essays>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
