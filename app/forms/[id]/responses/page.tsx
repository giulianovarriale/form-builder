import { getCurrentUser } from "@/app/repositories/current-user-repository";
import { getFormWithResponses } from "@/app/repositories/form-repository";
import { Card, CardContent } from "@/components/ui/card";
import { SearchX } from "lucide-react";
import { redirect } from "next/navigation";

type ResponseField = {
  id: string;
  label: string;
  value: string;
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getCurrentUser();

  const { id } = await params;

  if (!currentUser) {
    redirect("/sign-in");
  }

  const data = await getFormWithResponses({
    creatorId: currentUser.id,
    formId: id,
  });

  if (!data) {
    return (
      <div className="flex flex-col items-center py-12">
        <SearchX className="h-12 w-12 text-gray-400 mb-4" />

        <h2 className="text-xl font-medium mb-1">Page not found!</h2>

        <p className="text-gray-700 mb-6">
          It seems like the page you are looking for does not exist or has been
          deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{data.title}</h1>

        <p className="text-gray-700">
          {data.responses.length}{" "}
          {data.responses.length === 1 ? "response" : "responses"} received
        </p>
      </div>

      <div className="space-y-6">
        {data.responses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-md border">
            <p className="text-gray-700">No responses yet</p>
          </div>
        ) : (
          data.responses.map((response) => (
            <Card key={response.id} className="overflow-hidden">
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Submitted on</p>

                    <p className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                      {response.createdAt.toISOString()}
                    </p>
                  </div>

                  {(response.response as ResponseField[]).map((field) => (
                    <div key={field.id} className="space-y-2">
                      <p className="font-medium text-sm">{field.label}</p>

                      <p className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                        {field.value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
