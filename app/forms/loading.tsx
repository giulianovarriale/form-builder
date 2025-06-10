import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-8 w-30 mb-2 bg-slate-200" />
          <Skeleton className="h-5 w-56 mb-2 bg-slate-200" />
        </div>

        <Skeleton className="h-10 w-44 mb-2 bg-slate-200" />
      </div>
    </div>
  );
}
