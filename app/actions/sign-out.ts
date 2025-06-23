"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase";

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out error:", error);
    return;
  }

  redirect("/sign-in");
}
