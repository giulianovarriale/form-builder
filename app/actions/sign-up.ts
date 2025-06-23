"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase";

export async function signUp(
  _: { error: string } | undefined,
  formData: FormData,
) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    passwordConfirmation: formData.get("password-confirmation") as string,
  };

  if (data.password !== data.passwordConfirmation) {
    return {
      error: "Passwords do not match. Please try again.",
    };
  }

  const result = await supabase.auth.signUp(data);

  if (result.error) {
    return {
      error: "An error occurred. Please try again.",
    };
  }

  redirect("/forms");
}
