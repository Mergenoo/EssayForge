export interface Database {
  public: {
    Tables: {
      essays: {
        Row: {
          id: string;
          user_id: number;
          created_at: string;
          last_modified: string;
          is_tutorial_essay: boolean;
          title: string;
          folder: {
            id: string;
            user_id: number;
            created_at: string;
            last_modified: string;
            name: string;
          };
          status: string;
          is_starred: boolean;
          spell_check: boolean;
          is_public: boolean;
          is_publicly_commentable: boolean;
          is_trashed: boolean;
          trashed_at: string | null;
          updated_at: string;
          content: {
            id: string;
            type: "outlineTopic" | "paragraph";
            data: {
              text?: string;
              sentences?: {
                id: string;
                review: boolean;
                selected: number;
                rewrites: {
                  id: string;
                  text: string;
                }[];
              }[];
            };
          }[];
        };

        Insert: {
          user_id: number;
          title: string;
          folder: string;
          content: {
            id: string;
            type: "outlineTopic" | "paragraph";
            data: {
              text?: string;
              sentences?: {
                id: string;
                review: boolean;
                selected: number;
                rewrites: {
                  id: string;
                  text: string;
                }[];
              }[];
            };
          }[];
        };

        Update: Partial<{
          title: string;
          folder: string;
          content: {
            id: string;
            type: "outlineTopic" | "paragraph";
            data: {
              text?: string;
              sentences?: {
                id: string;
                review: boolean;
                selected: number;
                rewrites: {
                  id: string;
                  text: string;
                }[];
              }[];
            };
          }[];
        }>;
      };

      folders: {
        Row: {
          id: string;
          user_id: number;
          title: string;
          created_at: string;
          updated_at: string;
        };

        Insert: {
          user_id: number;
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
