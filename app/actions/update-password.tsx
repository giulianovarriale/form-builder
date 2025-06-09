"use server";

import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function updatePassword(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const password = formData.get("new-password") as string;
  const code = formData.get("code") as string;

  console.log({ password, code });

  if (!password) {
    return;
  }

  await supabase.auth.exchangeCodeForSession(code);
  await supabase.auth.updateUser({ password });

  redirect("/forms");
}
