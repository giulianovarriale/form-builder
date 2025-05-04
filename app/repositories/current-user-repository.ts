import { createClient } from "@/lib/supabase";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return data.user;
}
