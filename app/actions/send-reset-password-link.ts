"use server";

import { createClient } from "@/lib/supabase";
import { toAbsoluteUrl } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function sendResetPasswordLink(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  if (!email) {
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: toAbsoluteUrl("/update-password"),
  });

  if (error) {
    return;
  }

  redirect("/forgot-password/success");
}
