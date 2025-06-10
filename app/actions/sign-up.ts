"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase";

export async function signUp(_: void, formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    passwordConfirmation: formData.get("password-confirmation") as string,
  };

  if (data.password !== data.passwordConfirmation) {
    redirect("/error");
  }

  const result = await supabase.auth.signUp(data);

  if (result.error) {
    redirect("/error");
  }

  redirect("/forms");
}
