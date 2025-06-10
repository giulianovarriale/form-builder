import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex-1 max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-8 w-52 mb-2 bg-slate-200" />
        <Skeleton className="h-6 w-40 mb-2 bg-slate-200" />
      </div>

      <Skeleton className="bg-slate-200 h-[150px] w-full rounded-xl" />
    </div>
  );
}
