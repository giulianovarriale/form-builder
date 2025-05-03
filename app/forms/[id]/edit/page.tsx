import { updateForm } from "@/app/actions/update-form";
import { getFormById } from "@/app/repositories/form-repository";
import FormBuilder from "@/components/form/form-builder";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const form = await getFormById(id);

  if (!form) {
    return <div>Form not found</div>;
  }

  return (
    <FormBuilder
      title="Edit the form"
      description="Use the button in the side bar to add the fields"
      action={{ label: "Update Form", handler: updateForm }}
      initialValue={{
        id: form.id,
        title: form.title,
        description: form.description,
        fields: form.fields as Field[],
      }}
    />
  );
}
