export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      channels: {
        Row: {
          color_code: string;
          created_at: string;
          disp_order: number;
          group_name: string | null;
          group_name_jp: string | null;
          id: string;
          is_initial_sync_done: boolean;
          name: string;
          name_jp: string;
          updated_at: string;
          upload_playlist_id: string | null;
          youtube_channel_id: string;
        };
        Insert: {
          color_code: string;
          created_at?: string;
          disp_order?: number;
          group_name?: string | null;
          group_name_jp?: string | null;
          id?: string;
          is_initial_sync_done?: boolean;
          name: string;
          name_jp: string;
          updated_at?: string;
          upload_playlist_id?: string | null;
          youtube_channel_id: string;
        };
        Update: {
          color_code?: string;
          created_at?: string;
          disp_order?: number;
          group_name?: string | null;
          group_name_jp?: string | null;
          id?: string;
          is_initial_sync_done?: boolean;
          name?: string;
          name_jp?: string;
          updated_at?: string;
          upload_playlist_id?: string | null;
          youtube_channel_id?: string;
        };
        Relationships: [];
      };
      oshis: {
        Row: {
          channel_id: string;
          created_at: string;
          id: string;
          most_fav: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          channel_id: string;
          created_at?: string;
          id?: string;
          most_fav?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          channel_id?: string;
          created_at?: string;
          id?: string;
          most_fav?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'oshis_channel_id_fkey';
            columns: ['channel_id'];
            isOneToOne: false;
            referencedRelation: 'channels';
            referencedColumns: ['id'];
          },
        ];
      };
      tags: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      video_logs: {
        Row: {
          comment: string | null;
          created_at: string;
          id: string;
          is_favorite: boolean | null;
          is_watched: boolean | null;
          updated_at: string;
          user_id: string;
          youtube_video_id: string;
        };
        Insert: {
          comment?: string | null;
          created_at?: string;
          id?: string;
          is_favorite?: boolean | null;
          is_watched?: boolean | null;
          updated_at?: string;
          user_id: string;
          youtube_video_id: string;
        };
        Update: {
          comment?: string | null;
          created_at?: string;
          id?: string;
          is_favorite?: boolean | null;
          is_watched?: boolean | null;
          updated_at?: string;
          user_id?: string;
          youtube_video_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_video_logs_youtube_video_id';
            columns: ['youtube_video_id'];
            isOneToOne: false;
            referencedRelation: 'videos';
            referencedColumns: ['id'];
          },
        ];
      };
      video_tags: {
        Row: {
          created_at: string;
          id: string;
          tag_id: string;
          updated_at: string;
          user_id: string;
          youtube_video_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          tag_id: string;
          updated_at?: string;
          user_id: string;
          youtube_video_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          tag_id?: string;
          updated_at?: string;
          user_id?: string;
          youtube_video_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_video_tags_youtube_video_id';
            columns: ['youtube_video_id'];
            isOneToOne: false;
            referencedRelation: 'videos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'video_tags_tag_id_fkey';
            columns: ['tag_id'];
            isOneToOne: false;
            referencedRelation: 'tags';
            referencedColumns: ['id'];
          },
        ];
      };
      videos: {
        Row: {
          channel_id: string;
          comment_count: number | null;
          duration: string | null;
          id: string;
          like_count: number | null;
          published_at: string;
          raw_data: Json | null;
          thumbnail_url: string | null;
          title: string;
          updated_at: string;
          video_type: string;
          view_count: number | null;
        };
        Insert: {
          channel_id: string;
          comment_count?: number | null;
          duration?: string | null;
          id: string;
          like_count?: number | null;
          published_at: string;
          raw_data?: Json | null;
          thumbnail_url?: string | null;
          title: string;
          updated_at?: string;
          video_type?: string;
          view_count?: number | null;
        };
        Update: {
          channel_id?: string;
          comment_count?: number | null;
          duration?: string | null;
          id?: string;
          like_count?: number | null;
          published_at?: string;
          raw_data?: Json | null;
          thumbnail_url?: string | null;
          title?: string;
          updated_at?: string;
          video_type?: string;
          view_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'videos_channel_id_fkey';
            columns: ['channel_id'];
            isOneToOne: false;
            referencedRelation: 'channels';
            referencedColumns: ['id'];
          },
        ];
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
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
