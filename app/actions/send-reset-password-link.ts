"use server";

import { createClient } from "@/lib/supabase";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function sendResetPasswordLink(formData: FormData) {
  const supabase = await createClient();

  const headerValues = await headers();
  const host = headerValues.get("host");

  const email = formData.get("email") as string;

  if (!email) {
    return;
  }

  console.log({ host });

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/update-password",
  });

  if (error) {
    return;
  }

  redirect("/forgot-password/success");
}
