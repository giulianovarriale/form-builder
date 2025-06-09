import { getCurrentUser } from "@/app/repositories/current-user-repository";
import { getFormById } from "@/app/repositories/form-repository";
import FormView from "@/components/form/form-view";
import { Field } from "@/types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import { toAbsoluteUrl } from "@/lib/utils";

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

  return (
    <div className="px-4 py-12">
      {currentUser?.id === form.creatorId && (
        <Alert className="max-w-2xl mx-auto mb-6">
          <CheckCircle2Icon />
          <AlertTitle>Your form is live!</AlertTitle>

          <AlertDescription className="text-gray-700">
            Share the link to start collecting responses.
            <br />
            <span className="underline">{toAbsoluteUrl(`/forms/${id}`)}</span>
          </AlertDescription>
        </Alert>
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
