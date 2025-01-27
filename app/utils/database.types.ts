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

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
				PublicSchema['Views'])
		? (PublicSchema['Tables'] &
				PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema['Enums']
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
		? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;
