import { getCurrentUser } from "@/app/repositories/current-user-repository";
import { getFormById } from "@/app/repositories/form-repository";
import FormView from "@/components/form/form-view";
import { headers } from "next/headers";
import { Field } from "@/types";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await getFormById(id);

  const currentUser = await getCurrentUser();

  if (!form) {
    return null;
  }

  const headerValues = await headers();
  const host = headerValues.get("host");

  const formUrl = `https://${host}/forms/${id}`;

  return (
    <div className="px-4 py-12">
      {currentUser?.id === form.creatorId && (
        <div className="px-4 pb-8 max-w-3xl mx-auto">
          <p>
            Your form is live. Share the link to start collecting responses.
          </p>

          <p>
            <strong>{formUrl}</strong>
          </p>
        </div>
      )}

      <FormView
        id={form.id}
        title={form.title}
        description={form.description}
        fields={form.fields as Field[]}
      />
    </div>
  );
}
