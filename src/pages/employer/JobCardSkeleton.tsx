import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface JobCardSkeletonProps {
  count?: number;
}

export function JobCardSkeleton({
  count = 6,
}: JobCardSkeletonProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="p-5 border-border/60 shadow-sm min-h-[210px] flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4 rounded-md" />
              </div>

              <Skeleton className="h-6 w-20 rounded-full shrink-0" />
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-1">
                <Skeleton className="h-3.5 w-3.5 rounded-full" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>

              <div className="flex items-center gap-1">
                <Skeleton className="h-3.5 w-3.5 rounded-full" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>

              <div className="flex items-center gap-1">
                <Skeleton className="h-3.5 w-3.5 rounded-full" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/60">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-3 w-28 rounded" />
            </div>

            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </Card>
      ))}
    </div>
  );
}