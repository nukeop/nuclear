import { createClient, SupabaseClient } from '@supabase/supabase-js';

export abstract class NuclearSupabaseService {
protected client: SupabaseClient;

constructor(private supabaseUrl: string, private supabaseAnonKey: string) {
  this.client = createClient(supabaseUrl, supabaseAnonKey);
} 
}
