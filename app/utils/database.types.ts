export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			choices: {
				Row: {
					category: string | null;
					close_at: string | null;
					created_at: string | null;
					id: number;
					image_urls: string[] | null;
					remove_at: string | null;
					title: string | null;
					user_id: string | null;
					uuid: string;
					visibility: Database['public']['Enums']['Visibility'];
					voting_system: Database['public']['Enums']['VotingSystem'];
				};
				Insert: {
					category?: string | null;
					close_at?: string | null;
					created_at?: string | null;
					id?: number;
					image_urls?: string[] | null;
					remove_at?: string | null;
					title?: string | null;
					user_id?: string | null;
					uuid?: string;
					visibility?: Database['public']['Enums']['Visibility'];
					voting_system?: Database['public']['Enums']['VotingSystem'];
				};
				Update: {
					category?: string | null;
					close_at?: string | null;
					created_at?: string | null;
					id?: number;
					image_urls?: string[] | null;
					remove_at?: string | null;
					title?: string | null;
					user_id?: string | null;
					uuid?: string;
					visibility?: Database['public']['Enums']['Visibility'];
					voting_system?: Database['public']['Enums']['VotingSystem'];
				};
				Relationships: [
					{
						foreignKeyName: 'choices_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['user_id'];
					},
				];
			};
			profiles: {
				Row: {
					subscriptions: string[] | null;
					updated_at: string | null;
					user_id: string;
					username: string | null;
					website: string | null;
				};
				Insert: {
					subscriptions?: string[] | null;
					updated_at?: string | null;
					user_id: string;
					username?: string | null;
					website?: string | null;
				};
				Update: {
					subscriptions?: string[] | null;
					updated_at?: string | null;
					user_id?: string;
					username?: string | null;
					website?: string | null;
				};
				Relationships: [];
			};
			votes: {
				Row: {
					choice_id: number;
					image_urls: string[] | null;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					choice_id: number;
					image_urls?: string[] | null;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					choice_id?: number;
					image_urls?: string[] | null;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'votes_choice_id_fkey';
						columns: ['choice_id'];
						isOneToOne: false;
						referencedRelation: 'choices';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'votes_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['user_id'];
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
			Visibility: 'private' | 'promoted' | 'public' | 'draft';
			VotingSystem: '1' | '2';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
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
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
		| { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {
			Visibility: ['private', 'promoted', 'public', 'draft'],
			VotingSystem: ['1', '2'],
		},
	},
} as const;
