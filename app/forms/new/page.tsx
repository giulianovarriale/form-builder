import { createForm } from "@/app/actions/create-form";
import FormBuilder from "@/components/form/form-builder";

export default function Page() {
  return (
    <FormBuilder
      title="Create a new form"
      description="Use the buttons on the left panel to add fields to your form"
      action={{ label: "Create form", handler: createForm }}
    />
  );
}
