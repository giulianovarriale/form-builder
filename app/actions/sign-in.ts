"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase";

export async function signIn(
  _: { error: string } | undefined,
  formData: FormData,
) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      error: "Email or password is incorrect. Please try again.",
    };
  }

  redirect("/forms");
}
