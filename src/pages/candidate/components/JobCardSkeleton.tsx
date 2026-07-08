import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

type JobCardSkeletonProps = {
  count?: number;
};

export function JobCardSkeleton({
  count = 6,
}: JobCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden border-border/60"
        >
          <CardContent className="p-5">
            <div className="flex gap-4">
              {/* Logo */}
              <Skeleton className="h-12 w-12 rounded-lg shrink-0" />

              <div className="flex-1 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-60" />
                    <Skeleton className="h-4 w-40" />
                  </div>

                  <Skeleton className="h-6 w-6 rounded-md" />
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>

                {/* Badges */}
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-3 border-t">
                  <Skeleton className="h-9 w-20 rounded-md" />
                  <Skeleton className="h-9 w-24 rounded-md" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}