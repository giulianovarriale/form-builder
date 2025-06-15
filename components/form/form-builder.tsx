"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckSquare,
  ChevronDown,
  ChevronUp,
  FileText,
  List,
  Loader2Icon,
  Trash2,
  Type,
} from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, FormStructure } from "@/types";

type Props = {
  id?: string;
  title: string;
  description: string;
  action: {
    label: string;
    handler: (form: FormStructure) => Promise<void>;
  };

  initialValue?: FormStructure;
};

export default function FormBuilder({
  title,
  description,
  action,
  initialValue,
}: Props) {
  const idRef = useRef(initialValue?.fields?.length ?? 0);

  const [pending, startTransition] = useTransition();

  const [formTitle, setFormTitle] = useState(
    initialValue?.title ?? "Untitled form: click to edit",
  );

  const [formDescription, setFormDescription] = useState(
    initialValue?.description ?? "No description yet: click to edit",
  );

  const [fields, setFields] = useState<Field[]>(initialValue?.fields ?? []);

  function createId(prefix: string) {
    idRef.current = idRef.current + 1;
    return `${prefix}_${idRef.current}`;
  }

  function addText() {
    setFields(
      fields.concat({
        id: createId("text"),
        type: "text",
        isRequired: false,
        label: "My text field",
      }),
    );
  }

  function addParagraph() {
    setFields(
      fields.concat({
        id: createId("paragraph"),
        type: "paragraph",
        isRequired: false,
        label: "My paragraph field",
      }),
    );
  }

  function addCheckbox() {
    setFields(
      fields.concat({
        id: createId("checkbox"),
        type: "checkbox",
        isRequired: false,
        options: [
          {
            id: createId("checkbox-option"),
            label: "option 1",
          },
          {
            id: createId("checkbox-option"),
            label: "option 2",
          },
        ],
        label: "My checkbox field",
      }),
    );
  }

  function addSelect() {
    setFields(
      fields.concat({
        id: createId("select"),
        type: "select",
        isRequired: false,
        options: [
          {
            id: createId("select-option"),
            label: "option 1",
          },
          {
            id: createId("select-option"),
            label: "option 2",
          },
        ],
        label: "My select field",
      }),
    );
  }

  function changeFieldLabel(id: string, label: string) {
    setFields(fields.map((f) => (f.id === id ? { ...f, label } : { ...f })));
  }

  function removeField(id: string) {
    setFields(fields.filter((f) => f.id !== id));
  }

  function removeOption(fieldId: string, optionId: string) {
    const field = fields.find((f) => f.id === fieldId);

    if (!field) return;
    if (!("options" in field)) return;

    const options = field.options.filter((o) => o.id !== optionId);

    setFields(
      fields.map((f) => (f.id === fieldId ? { ...field, options } : { ...f })),
    );
  }

  function addOption(fieldId: string) {
    const field = fields.find((f) => f.id === fieldId);

    if (!field) return;
    if (!("options" in field)) return;

    const options = field.options.concat({
      id: createId("checkbox-option"),
      label: `option ${field.options.length + 1}`,
    });

    setFields(
      fields.map((f) => (f.id === fieldId ? { ...field, options } : { ...f })),
    );
  }

  function moveFieldUp(index: number) {
    if (index === 0) throw Error(`Cannot move field up for ${index} index`);

    const prevField = fields[index - 1];
    const currentField = fields[index];

    fields[index - 1] = currentField;
    fields[index] = prevField;

    setFields([...fields]);
  }

  function moveFieldDown(index: number) {
    if (index === fields.length - 1)
      throw Error(`Cannot move field down for ${index} index`);

    const nextField = fields[index + 1];
    const currentField = fields[index];

    fields[index + 1] = currentField;
    fields[index] = nextField;

    setFields([...fields]);
  }

  function changeOptionLabel(fieldId: string, optionId: string, label: string) {
    const field = fields.find((f) => f.id === fieldId);

    if (!field) return;
    if (!("options" in field)) return;

    const options = field.options.map((o) =>
      o.id === optionId ? { ...o, label } : { ...o },
    );

    setFields(
      fields.map((f) => (f.id === fieldId ? { ...field, options } : { ...f })),
    );
  }

  function updateIsFieldRequired(
    id: string,
    isRequired: boolean | "indeterminate",
  ) {
    if (isRequired === "indeterminate") return;

    const field = fields.find((f) => f.id === id);

    if (!field) return;

    setFields(
      fields.map((f) => (f.id === id ? { ...f, isRequired } : { ...f })),
    );
  }

  function renderField(field: Field) {
    const placeholder = `Enter your ${field.label}`;

    switch (field.type) {
      case "text":
        return <Input placeholder={placeholder} disabled />;
      case "paragraph":
        return (
          <Textarea
            placeholder={placeholder}
            className="min-h-[100px]"
            disabled
          />
        );
      case "checkbox":
        return (
          <div className="p-4 space-y-3">
            {field.options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <div className="flex items-center grow gap-2">
                  <Checkbox id={option.id} />

                  <Input
                    value={option.label}
                    className="w-full"
                    onChange={(e) =>
                      changeOptionLabel(field.id, option.id, e.target.value)
                    }
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => removeOption(field.id, option.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addOption(field.id)}
            >
              Add option
            </Button>
          </div>
        );
      case "select":
        return (
          <div className="p-4 space-y-3">
            {field.options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <div className="flex items-center grow gap-2">
                  <Input
                    value={option.label}
                    className="w-full"
                    onChange={(e) =>
                      changeOptionLabel(field.id, option.id, e.target.value)
                    }
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => removeOption(field.id, option.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addOption(field.id)}
            >
              Add option
            </Button>
          </div>
        );
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-2 md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-500">{description}</p>
        </div>

        <Button
          className="bg-purple-600 hover:bg-purple-700"
          disabled={pending}
          onClick={() =>
            startTransition(() =>
              action.handler({
                id: initialValue?.id,
                title: formTitle,
                description: formDescription,
                fields,
              }),
            )
          }
        >
          {pending && <Loader2Icon className="animate-spin" />}
          {action.label}
        </Button>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        <aside className="md:col-span-5 lg:col-span-3">
          <div className="p-6 rounded-md border bg-white">
            <p className="text-lg font-semibold mb-4">Add Form Elements</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                className="border rounded-md p-4 flex flex-col items-center gap-2 hover:bg-gray-50"
                onClick={addText}
              >
                <Type className="h-5 w-5" />
                <span className="text-sm font-medium">Text</span>
              </button>

              <button
                className="border rounded-md p-4 flex flex-col items-center gap-2 hover:bg-gray-50"
                onClick={addParagraph}
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm font-medium">Paragraph</span>
              </button>

              <button
                className="border rounded-md p-4 flex flex-col items-center gap-2 hover:bg-gray-50"
                onClick={addCheckbox}
              >
                <CheckSquare className="h-5 w-5" />
                <span className="text-sm font-medium">Checkbox</span>
              </button>

              <button
                className="border rounded-md p-4 flex flex-col items-center gap-2 hover:bg-gray-50"
                onClick={addSelect}
              >
                <List className="h-5 w-5" />
                <span className="text-sm font-medium">Select</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="md:col-span-7 lg:col-span-9 flex flex-col gap-4">
          <div className="p-6 rounded-md border bg-white flex flex-col gap-4">
            <input
              type="text"
              value={formTitle}
              className="text-2xl font-bold"
              placeholder="Click here to edit the title"
              onChange={(e) => setFormTitle(e.target.value)}
            />

            <input
              type="text"
              value={formDescription}
              placeholder="Click here to edit the description"
              className="text-gray-700"
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>

          {fields.length === 0 && (
            <div className="p-6 rounded-md border bg-white">
              <p className="text-lg font-semibold mb-4">No fields added yet.</p>

              <p className="text-sm text-gray-500">
                Click on the elements on the left panel to add them to your
                form.
              </p>
            </div>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-md bg-white">
              <div className="flex items-center justify-between gap-3 p-6 border-b">
                <div className="flex gap-4 grow items-center">
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveFieldUp(index)}
                      disabled={index === 0}
                      className={index === 0 ? "opacity-30" : undefined}
                    >
                      <ChevronUp className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-600" />
                    </button>

                    <button
                      onClick={() => moveFieldDown(index)}
                      disabled={index === fields.length - 1}
                      className={
                        index === fields.length - 1 ? "opacity-30" : undefined
                      }
                    >
                      <ChevronDown className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-600" />
                    </button>
                  </div>

                  <input
                    className="font-medium w-full"
                    value={field.label}
                    onChange={(e) => changeFieldLabel(field.id, e.target.value)}
                    placeholder={`Enter a label for your ${field.type} field`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`${field.id}_required`}
                      checked={field.isRequired}
                      onCheckedChange={(checked) =>
                        updateIsFieldRequired(field.id, checked)
                      }
                    />

                    <label htmlFor={`${field.id}_required`} className="text-sm">
                      Required
                    </label>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => removeField(field.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-8">{renderField(field)}</div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
