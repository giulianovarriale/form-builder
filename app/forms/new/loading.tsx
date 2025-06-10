import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-6">
      <aside className="md:col-span-1">
        <Skeleton className="h-[250px] w-full bg-slate-200" />
      </aside>
      <main className="md:col-span-3 flex flex-col">
        <div className="flex justify-between items-center p-6">
          <div>
            <Skeleton className="h-8 w-30 bg-slate-200 mb-3" />
            <Skeleton className="h-5 w-80 bg-slate-200" />
          </div>

          <Skeleton className="h-10 w-30 bg-slate-200" />
        </div>

        <div className="flex flex-col gap-4">
          <Skeleton className="h-[150px] w-full bg-slate-200" />

          <Skeleton className="h-[150px] w-full bg-slate-200" />
        </div>
      </main>
    </div>
  );
}
