"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../repositories/current-user-repository";
import { FormStructure } from "@/types";

export async function createForm(form: FormStructure) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  await prisma.form.create({
    data: {
      title: form.title,
      description: form.description,
      creatorId: currentUser.id,
      fields: form.fields,
    },
  });

  redirect("/forms");
}
