"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../repositories/current-user-repository";
import { FormStructure } from "@/types";

const GENERIC_ERROR_MESSAGE =
  "Something went wrong while updating the form. Please try again.";

export async function updateForm(
  _: { error: string } | undefined,
  form: FormStructure,
) {
  const currentUser = await getCurrentUser();

  if (!form.id) {
    console.error("Form ID is required for updating the form.");

    return {
      error: GENERIC_ERROR_MESSAGE,
    };
  }

  if (!currentUser) {
    console.error(
      `User is not authenticated to update form with ID ${form.id}.`,
    );

    return {
      error: GENERIC_ERROR_MESSAGE,
    };
  }

  const persistedForm = await prisma.form.findUnique({
    where: {
      id: form.id,
    },
  });

  if (!persistedForm) {
    console.error(`Form with ID ${form.id} does not exist.`);

    return {
      error: GENERIC_ERROR_MESSAGE,
    };
  }

  try {
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
  } catch (error) {
    console.error(`Error updating form with ID ${form.id}.`, error);

    return {
      error: GENERIC_ERROR_MESSAGE,
    };
  }

  redirect("/forms");
}
