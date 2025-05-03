import { createForm } from "@/app/actions/create-form";
import FormBuilder from "@/components/form/form-builder";

export default function Page() {
  return (
    <FormBuilder
      title="My new Form"
      description="Use the button in the side bar to add the fields"
      action={{ label: "Save new Form", handler: createForm }}
    />
  );
}
