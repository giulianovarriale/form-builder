import { createClient } from "@/lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getCurrentUser(supabase?: SupabaseClient) {
  const supabaseClient = supabase ?? (await createClient());
  const { data } = await supabaseClient.auth.getUser();

  return data.user;
}
