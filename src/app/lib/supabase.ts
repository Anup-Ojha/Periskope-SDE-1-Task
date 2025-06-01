export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          created_at?: string;
        };
      };
      'user-profile': {
        Row: {
          id: string;
          name: string | null;
          phone: string | null;
          description: string | null;
          profile_pic_data: string | null;
          profile_pic_type: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          phone?: string | null;
          description?: string | null;
          profile_pic_data?: string | null;
          profile_pic_type?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          phone?: string | null;
          description?: string | null;
          profile_pic_data?: string | null;
          profile_pic_type?: string | null;
        };
      };
      contacts: {
        Row: {
          id: number;
          user_id: string;
          contact_user_id: string | null;
          contactName: string | null;
          contactNumber: string;
          profilePic: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          contact_user_id?: string | null;
          contactName?: string | null;
          contactNumber: string;
          profilePic?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          contact_user_id?: string | null;
          contactName?: string | null;
          contactNumber?: string;
          profilePic?: string | null;
        };
      };
      messages: {
        Row: {
          id: number;
          sender_id: string;
          recipient_id: string;
          content: string;
          timestamp: string;
        };
        Insert: {
          id?: number;
          sender_id: string;
          recipient_id: string;
          content: string;
          timestamp?: string;
        };
        Update: {
          id?: number;
          sender_id?: string;
          recipient_id?: string;
          content?: string;
          timestamp?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};