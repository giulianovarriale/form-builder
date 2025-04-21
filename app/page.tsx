"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Type } from "lucide-react";
import { useRef, useState } from "react";

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

  function changeFieldLabel(id: string, label: string) {
    setFields(fields.map((f) => (f.id === id ? { ...f, label } : { ...f })));
  }

  return (
    <div className="container mx-auto px-4 py-6 grid md:grid-cols-4 gap-6">
      <aside className="md:col-span-1">
        <div className="p-6 rounded-md border bg-white">
          <p className="text-lg font-semibold mb-4">Add Form Elements</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              className="border rounded-md p-4 flex flex-col items-center gap-2 hover:bg-gray-50 cursor-pointer"
              onClick={addText}
            >
              <Type className="h-5 w-5" />
              <span className="text-sm font-medium">Text</span>
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

        {fields.map((field) => (
          <div key={field.id} className="border rounded-md bg-white">
            <div className="flex items-center justify-between gap-3 p-6 border-b">
              <input
                className="font-medium w-full"
                value={field.label}
                onChange={(e) => changeFieldLabel(field.id, e.target.value)}
                placeholder="Enter a label for your field"
              />

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox id={`${field.id}_required`} checked={true} />

                  <label htmlFor={`${field.id}_required`} className="text-sm">
                    Required
                  </label>
                </div>
              </div>
            </div>

            <div className="p-8">
              <Input placeholder={`Enter your ${field.label}`} />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
