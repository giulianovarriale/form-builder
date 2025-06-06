import { getFormWithResponses } from '@/app/repositories/form-repository';
import { Card, CardContent } from '@/components/ui/card';

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
  const { id } = await params;

  const data = await getFormWithResponses(id);

  if (!data) {
    return <div className="container mx-auto px-4 py-8">Form not found</div>;
  }

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{data.title} - Responses</h1>

        <p className="text-gray-500">
          {data.responses.length}{' '}
          {data.responses.length === 1 ? 'response' : 'responses'} received
        </p>
      </div>

      <div className="space-y-6">
        {data.responses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-md border">
            <p className="text-gray-500">No responses yet</p>
          </div>
        ) : (
          data.responses.map((response) => (
            <Card key={response.id} className="overflow-hidden">
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="font-medium text-sm text-gray-500">
                      Submitted on
                    </p>

                    <p className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                      {response.createdAt.toISOString()}
                    </p>
                  </div>

                  {(response.response as ResponseField[]).map((field) => (
                    <div key={field.id} className="space-y-2">
                      <p className="font-medium text-sm text-gray-500">
                        {field.label}
                      </p>

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
