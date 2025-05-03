import Link from "next/link";
import { Plus, FileText, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { getFormByCreatorId } from "../repositories/form-repository";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/sign-in");
  }

  const forms = await getFormByCreatorId(data.user.id);

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
                  href={`/forms/${form.id}/edit`}
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
