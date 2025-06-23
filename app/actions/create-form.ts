"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../repositories/current-user-repository";
import { FormStructure } from "@/types";

export async function createForm(
  _: { error: string } | undefined,
  form: FormStructure,
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      error: "You must be signed in to create a form.",
    };
  }

  const validationResult = validateForm(form);

  if (!validationResult.valid) {
    return {
      error: validationResult.error,
    };
  }

  try {
    await prisma.form.create({
      data: {
        title: form.title,
        description: form.description,
        creatorId: currentUser.id,
        fields: form.fields,
      },
    });
  } catch (error) {
    console.error("Error creating form:", error);

    return {
      error: "An error occurred while creating the form. Please try again.",
    };
  }

  redirect("/forms");
}

function validateForm(form: FormStructure) {
  if (form.title.trim() === "") {
    return {
      valid: false,
      error: "Form title is required.",
    };
  }

  if (form.description.trim() === "") {
    return {
      valid: false,
      error: "Form description is required.",
    };
  }

  if (form.fields.length === 0) {
    return {
      valid: false,
      error: "At least one field is required in the form.",
    };
  }

  return { valid: true };
}
