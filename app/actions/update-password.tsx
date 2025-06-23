"use server";

import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function updatePassword(
  _: { error: string } | undefined,
  formData: FormData,
) {
  const supabase = await createClient();

  const password = formData.get("new-password") as string;
  const code = formData.get("code") as string;

  if (!password) {
    return {
      error: "Password is required. Please try again.",
    };
  }

  await supabase.auth.exchangeCodeForSession(code);

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return {
      error: "An error occurred. Please try again.",
    };
  }

  redirect("/forms");
}
