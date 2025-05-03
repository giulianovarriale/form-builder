"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function updateForm(form: FormStructure) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  console.log({ id: form.id });

  if (!form.id) {
    return;
  }

  if (!data.user) {
    return;
  }

  const persistedForm = await prisma.form.findUnique({
    where: {
      id: form.id,
    },
  });

  if (!persistedForm) {
    return;
  }

  await prisma.form.update({
    data: {
      title: form.title,
      description: form.description,
      creatorId: data.user.id,
      fields: form.fields,
    },
    where: {
      id: form.id,
    },
  });

  redirect("/forms");
}
