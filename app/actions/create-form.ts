"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function createForm(form: FormStructure) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return;
  }

  await prisma.form.create({
    data: {
      title: form.title,
      description: form.description,
      creatorId: data.user.id,
      fields: form.fields,
    },
  });

  redirect("/forms");
}
