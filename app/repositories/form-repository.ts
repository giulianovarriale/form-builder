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
