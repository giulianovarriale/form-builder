"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../repositories/current-user-repository";

export async function updateForm(form: FormStructure) {
  const currentUser = await getCurrentUser();

  if (!form.id) {
    return;
  }

  if (!currentUser) {
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
      creatorId: currentUser.id,
      fields: form.fields,
    },
    where: {
      id: form.id,
    },
  });

  redirect("/forms");
}
