"use server";

import prisma from "@/lib/prisma";
import { Field } from "@/types";

type FormResponse = {
  formId: string;
  fields: Array<{ id: string; value: string }>;
};

export async function submitForm({ formId, fields }: FormResponse) {
  const form = await prisma.form.findUnique({
    where: {
      id: formId,
    },
  });

  if (!form) {
    return;
  }

  const data = (form.fields as Field[]).map((field) => {
    const response = fields.find(
      (fieldResponse) => fieldResponse.id === field.id,
    );

    if (!response?.value) {
      return {
        id: field.id,
        label: field.label,
        value: "",
      };
    }

    if (field.type === "checkbox") {
      return {
        id: field.id,
        label: field.label,
        value: response.value
          .split(", ")
          .map(
            (id) =>
              field.options.find((option) => option.id === id)?.label ?? "",
          )
          .join(", "),
      };
    }

    if (field.type === "select") {
      return {
        id: field.id,
        label: field.label,
        value:
          field.options.find((option) => option.id === response.value)?.label ??
          "",
      };
    }

    return {
      id: field.id,
      label: field.label,
      value: response.value,
    };
  });

  await prisma.formResponse.create({
    data: {
      formId,
      response: data,
    },
  });
}
