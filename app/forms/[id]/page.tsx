import { getCurrentUser } from "@/app/repositories/current-user-repository";
import { getFormById } from "@/app/repositories/form-repository";
import FormView from "@/components/form/form-view";
import { Field } from "@/types";

import { CheckCircle } from "lucide-react";
import { toAbsoluteUrl } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { ShareFormButton } from "../_components/share-form-button";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await getFormById(id);

  const currentUser = await getCurrentUser();

  if (!form) {
    return null;
  }

  const formUrl = toAbsoluteUrl(`/forms/${id}`);

  return (
    <div className="px-4 py-12">
      {currentUser?.id === form.creatorId && (
        <Card className="w-full max-w-2xl mx-auto mb-6">
          <CardContent>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Form Published Successfully
                  </p>

                  <p className="text-sm text-gray-600">
                    Ready to collect responses
                  </p>
                </div>
              </div>

              <ShareFormButton url={formUrl} />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 py-3">
              <span className="text-sm text-gray-600 break-all">{formUrl}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <FormView
        id={form.id}
        title={form.title}
        description={form.description}
        fields={form.fields as Field[]}
      />
    </div>
  );
}
