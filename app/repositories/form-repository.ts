import prisma from "@/lib/prisma";

export async function getFormByCreatorId(userId: string) {
  return prisma.form.findMany({
    where: {
      creatorId: userId,
    },
  });
}

export async function getFormById(formId: string) {
  return prisma.form.findUnique({
    where: {
      id: formId,
    },
  });
}

export async function getFormWithResponses({
  formId,
  creatorId,
}: {
  formId: string;
  creatorId: string;
}) {
  return prisma.form.findUnique({
    where: {
      id: formId,
      creatorId,
    },
    include: {
      responses: true,
    },
  });
}
