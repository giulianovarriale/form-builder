"use client";

import type React from "react";

import { FormEvent, useState, useTransition } from "react";

import { Loader2Icon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitForm } from "@/app/actions/submit-form";
import { Field } from "@/types";
import { Card } from "../ui/card";

type Props = {
  id: string;
  title: string;
  description: string;
  fields: Field[];
};

export default function FormView({ id, title, description, fields }: Props) {
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const invalidFields = fields.filter(
      (field) => field.isRequired && formData.getAll(field.id).length === 0,
    );

    if (invalidFields.length > 0) {
      const errors = invalidFields.reduce(
        (acc, field) => ({
          ...acc,
          [field.id]: "Field is required",
        }),
        {},
      );

      setErrors(errors);

      return;
    }

    startTransition(async () => {
      await submitForm({
        formId: id,
        fields: fields.map((field) => {
          const value = formData.getAll(field.id);

          return {
            id: field.id,
            value: value.join(", "),
          };
        }),
      });

      setErrors({});
      setIsSubmitted(true);
    });
  }

  if (isSubmitted) {
    return (
      <div className="px-4 py-12 flex flex-col items-center">
        <div className="bg-green-100 rounded-full p-4 mb-6">
          <Send className="h-8 w-8 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold mb-2">
          Form Submitted Successfully!
        </h2>

        <p className="text-gray-600">
          Thank you for your submission. We have received your response.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <div className="bg-white px-6 border-b pb-7">
          <h2 className="text-2xl font-medium mb-1">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>

        <form
          className="space-y-6 px-6 rounded-md bg-white"
          onSubmit={onSubmit}
        >
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block font-medium">
                {field.label}
                {field.isRequired && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>

              {errors[field.id] && (
                <p className="text-red-500 text-md">{errors[field.id]}</p>
              )}

              {field.type === "text" && (
                <Input name={field.id} required={field.isRequired} />
              )}

              {field.type === "paragraph" && (
                <Textarea
                  name={field.id}
                  required={field.isRequired}
                  className="min-h-[100px]"
                />
              )}

              {field.type === "select" && (
                <Select name={field.id} required={field.isRequired}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>

                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "checkbox" && (
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <Checkbox
                        name={field.id}
                        id={option.id}
                        value={option.id}
                      />
                      <label htmlFor={option.id}>{option.label}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Button
            size="lg"
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={pending}
          >
            {pending ? <Loader2Icon className="animate-spin" /> : <Send />}
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}
