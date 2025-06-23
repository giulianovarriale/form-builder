"use server";

import { createClient } from "@/lib/supabase";
import { toAbsoluteUrl } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function sendResetPasswordLink(
  _: { error: string } | undefined,
  formData: FormData,
) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  if (!email) {
    return {
      error: "Email is required. Please try again.",
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: toAbsoluteUrl("/update-password"),
  });

  if (error) {
    return {
      error:
        "An error occurred while sending the reset password link. Please try again.",
    };
  }

  redirect("/forgot-password/success");
}
