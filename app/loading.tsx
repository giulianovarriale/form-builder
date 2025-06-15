import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto py-32">
      <Loader2Icon className="animate-spin mx-auto size-12 text-purple-600" />
    </div>
  );
}
