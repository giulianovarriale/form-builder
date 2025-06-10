import Link from "next/link";
import { Plus, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import { redirect } from "next/navigation";
import { getFormByCreatorId } from "../repositories/form-repository";
import { getCurrentUser } from "../repositories/current-user-repository";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  const forms = await getFormByCreatorId(currentUser.id);

  // return (
  //   <div className="container mx-auto px-4 py-12">
  //     <div className="flex justify-between items-center mb-8">
  //       <div>
  //         <Skeleton className="h-8 w-48 mb-2 bg-slate-400" />
  //         <Skeleton className="h-8 w-48 mb-2 bg-slate-400" />
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Forms</h1>
          <p className="text-gray-500">Manage and create your forms</p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-700" asChild>
          <Link href="/forms/new">
            <Plus className="h-4 w-4" /> Create New Form
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
              <Plus className="h-4 w-4" /> Create New Form
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id}>
              <CardContent className="flex flex-col gap-2">
                <h2 className="font-medium truncate flex-1">{form.title}</h2>

                <p className="text-gray-600 text-sm line-clamp-2">
                  {form.description}
                </p>
              </CardContent>

              <CardFooter className="flex gap-3 text-sm">
                <Link
                  href={`/forms/${form.id}`}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Preview
                </Link>

                <Separator orientation="vertical" />

                <Link
                  href={`/forms/${form.id}/edit`}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Edit
                </Link>

                <Separator orientation="vertical" />

                <Link
                  href={`/forms/${form.id}/responses`}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Responses
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
