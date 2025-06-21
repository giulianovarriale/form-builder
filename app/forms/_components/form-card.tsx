import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Form } from "@/generated/prisma/client";

import { BarChart3, Eye, Edit3 } from "lucide-react";
import Link from "next/link";

type Props = {
  form: Form;
};

export default function Component({ form }: Props) {
  return (
    <Card className="hover:shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold truncate">
          {form.title}
        </CardTitle>

        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {form.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-9 text-xs font-medium "
          asChild
        >
          <Link href={`/forms/${form.id}/edit`}>
            <Edit3 className="mr-2 h-3.5 w-3.5" />
            Edit
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-9 text-xs font-medium"
          asChild
        >
          <Link href={`/forms/${form.id}`}>
            <Eye className="mr-2 h-3.5 w-3.5" />
            Preview
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-9 text-xs font-medium"
          asChild
        >
          <Link href={`/forms/${form.id}/responses`}>
            <BarChart3 className="mr-2 h-3.5 w-3.5" />
            Responses
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
