"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, FileText, Trash2, Type } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  const [fields, setFields] = useState<Field[]>([]);

  const idRef = useRef(0);

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
      })
    );
  }

  function addParagraph() {
    setFields(
      fields.concat({
        id: createId("paragraph"),
        type: "paragraph",
        isRequired: false,
        label: "My paragraph field",
      })
    );
  }

  function changeFieldLabel(id: string, label: string) {
    setFields(fields.map((f) => (f.id === id ? { ...f, label } : { ...f })));
  }

  function removeField(id: string) {
    setFields(fields.filter((f) => f.id !== id));
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

      default:
        throw Error(
          `Field type ${field.type} is not supported. Please add a new field type.`
        );
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 grid md:grid-cols-4 gap-6">
      <aside className="md:col-span-1">
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
          </div>
        </div>
      </aside>

      <main className="md:col-span-3 flex flex-col gap-4">
        {fields.length === 0 && (
          <div className="p-6 rounded-md border bg-white">
            <p className="text-lg font-semibold mb-4">No fields added yet.</p>

            <p className="text-sm text-gray-500">
              Click on the elements on the left to add them to your form.
            </p>
          </div>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-md bg-white">
            <div className="flex items-center justify-between gap-3 p-6 border-b">
              <div className="flex gap-4 items-center">
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
                  <Checkbox id={`${field.id}_required`} checked={true} />

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
  );
}
