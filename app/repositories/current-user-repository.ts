import { createClient } from "@/lib/supabase";
import { createServerClient } from "@supabase/ssr";

export async function getCurrentUser(
  supabase?: ReturnType<typeof createServerClient>,
) {
  const supabaseClient = supabase ?? (await createClient());
  const { data } = await supabaseClient.auth.getUser();

  return data.user;
}
