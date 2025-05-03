import Link from "next/link";

import { Plus, FileText, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

// Mock data for forms
const forms = [
  {
    id: "1",
    title: "Customer Feedback Survey",
    description: "Collect feedback from customers about our new product",
    createdAt: new Date(2025, 3, 25), // April 25, 2025
    responses: 24,
  },
  {
    id: "2",
    title: "Event Registration",
    description: "Registration form for the annual conference",
    createdAt: new Date(2025, 3, 20), // April 20, 2025
    responses: 156,
  },
  {
    id: "3",
    title: "Job Application",
    description: "Application form for software developer position",
    createdAt: new Date(2025, 3, 15), // April 15, 2025
    responses: 42,
  },
  {
    id: "4",
    title: "Newsletter Signup",
    description: "Form to collect email addresses for newsletter",
    createdAt: new Date(2025, 3, 10), // April 10, 2025
    responses: 310,
  },
  {
    id: "5",
    title: "Contact Information",
    description: "Basic contact information collection form",
    createdAt: new Date(2025, 3, 5), // April 5, 2025
    responses: 18,
  },
];

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Forms</h1>
          <p className="text-gray-500">Manage and create your forms</p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-700" asChild>
          <Link href="/forms/new">
            <Plus className="mr-2 h-4 w-4" /> Create New Form
          </Link>
        </Button>
      </div>

      {forms.length === 0 ? (
        <div className="flex flex-col items-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />

          <h2 className="text-xl font-medium mb-1">No forms yet</h2>

          <p className="text-gray-500 mb-6">
            Create your first form to get started
          </p>

          <Button className="bg-purple-600 hover:bg-purple-700" asChild>
            <Link href="forms/new">
              <Plus className="mr-2 h-4 w-4" /> Create New Form
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id}>
              <CardHeader>
                <Link
                  href={`/forms/${form.id}`}
                  className="font-medium hover:text-purple-700 truncate flex-1"
                >
                  {form.title}
                </Link>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {form.description}
                </p>
              </CardContent>

              <CardFooter className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>{form.createdAt.toISOString().split("T")[0]}</span>
                </div>

                <div>{form.responses} responses</div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
