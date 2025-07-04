import Link from "next/link";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

import { redirect } from "next/navigation";
import { getFormByCreatorId } from "../repositories/form-repository";
import { getCurrentUser } from "../repositories/current-user-repository";
import FormCard from "./_components/form-card";

export default async function Page() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  const forms = await getFormByCreatorId(currentUser.id);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Forms</h1>
          <p className="text-gray-500">Manage and create your forms</p>
        </div>

        <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
          <Link href="/forms/new">
            <FileText />
            New Form
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

          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700"
            asChild
          >
            <Link href="/forms/new">
              <FileText />
              New Form
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      )}
    </div>
  );
}
